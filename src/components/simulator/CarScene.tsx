'use client';

/**
 * Escena 3D del simulador (se carga con dynamic import solo cerca del viewport).
 * - frameloop="demand": solo se renderiza cuando algo cambia (no recalienta el celular).
 * - Sin paneo; rotación vertical y zoom limitados; la rueda del mouse NO se captura.
 */
import { Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { CameraControls, CameraControlsImpl, ContactShadows, Environment, Lightformer, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js';
import { drawCrack, drawSheen } from './crack';
import { FILM_TINT_COLOR, glassOpacity, type SimState } from './tint';

const { ACTION } = CameraControlsImpl;

export type SceneApi = {
  rotate: (azimuth: number, polar: number) => void;
  zoom: (delta: number) => void;
};

export type CaptureConfig = {
  /** a0…a5 = ángulos exteriores, 'interior', 'windshield' */
  shot: string;
  layer: 'base' | 'mask-side' | 'mask-ws' | 'preview';
};

type Props = {
  modelUrl: string;
  state: SimState;
  active: boolean;
  interactive: boolean;
  isTouch: boolean;
  reducedMotion: boolean;
  onReady?: () => void;
  onUserInteract?: () => void;
  apiRef?: MutableRefObject<SceneApi | null>;
  capture?: CaptureConfig;
};

// ——— Cámara ———
const EXT_TARGET = new THREE.Vector3(0, 0.62, 0);
const EXT_DISTANCE = 6.3;
const EXT_POLAR = THREE.MathUtils.degToRad(70);
/** Posición del conductor (volante a la izquierda, lado +X). Frente del auto = +Z. */
const DRIVER_EYE = new THREE.Vector3(0.37, 1.19, -0.08);
// mirando en diagonal hacia adelante-izquierda: se ven el parabrisas y la ventanilla del conductor
const DRIVER_LOOK = new THREE.Vector3(0.52, 1.16, 0.24);
const FOV_EXTERIOR = 38;
const FOV_INTERIOR = 64;
/** FOV vertical que garantiza un ancho horizontal mínimo (pantallas verticales). */
function fovFor(minVertical: number, minHorizontalDeg: number, aspect: number) {
  const h = THREE.MathUtils.degToRad(minHorizontalDeg);
  const v = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(h / 2) / aspect));
  return Math.min(80, Math.max(minVertical, v));
}
/** Ángulos fijos para las imágenes de la versión liviana (grados de acimut). */
export const CAPTURE_AZIMUTHS = [35, 90, 145, 215, 270, 325];

function spherical(az: number, polar: number, dist: number, target = EXT_TARGET) {
  return new THREE.Vector3().setFromSphericalCoords(dist, polar, az).add(target);
}

// ——— Auto ———
type CarMaterials = {
  side: THREE.MeshPhysicalMaterial;
  windshield: THREE.MeshPhysicalMaterial;
  windshieldMesh: THREE.Mesh | null;
};

function Car({ url, state, capture, onLoaded }: { url: string; state: SimState; capture?: CaptureConfig; onLoaded: (m: CarMaterials) => void }) {
  const gltf = useGLTF(url, false, true);
  const scene = gltf.scene;

  const mats = useMemo<CarMaterials>(() => {
    const glassBase = {
      transparent: true,
      roughness: 0.04,
      metalness: 0,
      envMapIntensity: 0.85,
      side: THREE.DoubleSide,
      depthWrite: false,
      specularIntensity: 1,
    };
    const side = new THREE.MeshPhysicalMaterial({ ...glassBase, color: FILM_TINT_COLOR.clear, opacity: glassOpacity('none') });
    const windshield = new THREE.MeshPhysicalMaterial({ ...glassBase, color: FILM_TINT_COLOR.clear, opacity: glassOpacity('none') });
    // Carrocería gris oscuro casi mate para que combine con el amarillo de la marca
    const paint = new THREE.MeshPhysicalMaterial({
      color: '#33373d',
      metalness: 0.5,
      roughness: 0.42,
      clearcoat: 0.45,
      clearcoatRoughness: 0.3,
      envMapIntensity: 1.25,
    });
    let windshieldMesh: THREE.Mesh | null = null;
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      const name = mesh.name || mesh.parent?.name || '';
      if (name.startsWith('glass_windshield')) {
        mesh.material = windshield;
        mesh.renderOrder = 2;
        windshieldMesh = mesh;
      } else if (name.startsWith('glass_')) {
        mesh.material = side;
        mesh.renderOrder = 2;
      } else if ((mesh.material as THREE.Material)?.name === 'paint') {
        mesh.material = paint;
      }
    });
    return { side, windshield, windshieldMesh };
  }, [scene]);

  // Modo captura de máscaras: todo negro salvo los vidrios pedidos (blanco opaco)
  useLayoutEffect(() => {
    if (!capture || (capture.layer !== 'mask-side' && capture.layer !== 'mask-ws')) return;
    const black = new THREE.MeshBasicMaterial({ color: 'black' });
    const white = new THREE.MeshBasicMaterial({ color: 'white', side: THREE.DoubleSide });
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const name = mesh.name || mesh.parent?.name || '';
      const isWs = name.startsWith('glass_windshield');
      const isSide = name.startsWith('glass_') && !isWs;
      mesh.material = (capture.layer === 'mask-ws' ? isWs : isSide) ? white : black;
    });
  }, [capture, scene]);

  useEffect(() => onLoaded(mats), [mats, onLoaded]);

  // Transición suave del tono
  const targetColor = useMemo(() => new THREE.Color(), []);
  useFrame((s, dt) => {
    const k = 1 - Math.exp(-Math.min(dt, 0.05) * 7);
    const sideOpacity = glassOpacity(state.tint);
    const wsOpacity = state.includeWindshield ? sideOpacity : glassOpacity('none');
    let moving = false;
    const step = (m: THREE.MeshPhysicalMaterial, opacity: number, color: string) => {
      targetColor.set(color);
      const d = opacity - m.opacity;
      if (Math.abs(d) > 0.002) {
        m.opacity += d * k;
        moving = true;
      } else m.opacity = opacity;
      if (!m.color.equals(targetColor)) {
        m.color.lerp(targetColor, k);
        if (Math.abs(m.color.r - targetColor.r) + Math.abs(m.color.g - targetColor.g) + Math.abs(m.color.b - targetColor.b) < 0.003) m.color.copy(targetColor);
        else moving = true;
      }
    };
    const filmColor = state.tint === 'none' ? FILM_TINT_COLOR.clear : FILM_TINT_COLOR[state.film];
    step(mats.side, sideOpacity, filmColor);
    step(mats.windshield, wsOpacity, state.includeWindshield ? filmColor : FILM_TINT_COLOR.clear);
    if (moving) s.invalidate();
  });

  return <primitive object={scene} position={[0, 0.02, 0]} />;
}

// ——— Rajadura y brillo del parabrisas ———
function WindshieldFx({ mesh, mode, visible, exportMeta }: { mesh: THREE.Mesh | null; mode: 'antes' | 'despues'; visible: boolean; exportMeta?: boolean }) {
  const { invalidate, camera } = useThree();
  const progress = useRef(mode === 'despues' ? 1 : 0);

  const fx = useMemo(() => {
    if (!mesh || typeof document === 'undefined') return null;
    mesh.updateWorldMatrix(true, false);
    const ray = new THREE.Raycaster();
    const hit = (from: THREE.Vector3, to: THREE.Vector3) => {
      ray.set(from, to.clone().sub(from).normalize());
      return ray.intersectObject(mesh, false)[0];
    };
    // Impacto del lado del conductor
    const impact = hit(new THREE.Vector3(0.32, 2.6, 2.8), new THREE.Vector3(0.32, 1.12, 0.82));
    const center = hit(new THREE.Vector3(0, 2.6, 2.8), new THREE.Vector3(0, 1.15, 0.86));
    if (!impact || !center) return null;
    const orient = (p: THREE.Intersection) => {
      const n = p.face!.normal.clone().transformDirection(mesh.matrixWorld);
      const helper = new THREE.Object3D();
      helper.position.copy(p.point);
      helper.lookAt(p.point.clone().add(n));
      return helper.rotation.clone();
    };
    const crackTex = new THREE.CanvasTexture(drawCrack());
    crackTex.colorSpace = THREE.SRGBColorSpace;
    crackTex.anisotropy = 4;
    const sheenTex = new THREE.CanvasTexture(drawSheen());
    sheenTex.wrapS = sheenTex.wrapT = THREE.ClampToEdgeWrapping;
    const decalMat = (map: THREE.Texture) =>
      new THREE.MeshBasicMaterial({
        map,
        transparent: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        toneMapped: false,
      });
    return {
      crackGeo: new DecalGeometry(mesh, impact.point, orient(impact), new THREE.Vector3(0.95, 0.95, 0.6)),
      crackMat: decalMat(crackTex),
      sheenGeo: new DecalGeometry(mesh, center.point, orient(center), new THREE.Vector3(1.9, 1.2, 0.9)),
      sheenMat: decalMat(sheenTex),
      sheenTex,
      impact: impact.point.clone(),
    };
  }, [mesh]);

  useEffect(() => {
    if (mode === 'antes') progress.current = 0;
    invalidate();
  }, [mode, invalidate]);

  useFrame((s, dt) => {
    if (!fx) return;
    if (exportMeta) {
      // Posición de la rajadura en pantalla (para la versión liviana con imágenes)
      const c = fx.impact.clone().project(camera);
      const edge = fx.impact.clone().add(new THREE.Vector3(0.45, 0, 0)).project(camera);
      (window as unknown as { __simMeta: object }).__simMeta = {
        x: (c.x + 1) / 2,
        y: (1 - c.y) / 2,
        r: Math.abs(edge.x - c.x) / 2,
      };
    }
    let p = progress.current;
    if (mode === 'despues' && p < 1) {
      p = Math.min(1, p + Math.min(dt, 0.05) / 1.4);
      progress.current = p;
      s.invalidate();
    }
    const fade = THREE.MathUtils.smoothstep(p, 0.25, 0.7);
    fx.crackMat.opacity = 1 - fade;
    fx.sheenTex.offset.x = THREE.MathUtils.lerp(0.75, -0.75, p);
    fx.sheenMat.opacity = mode === 'despues' && p < 1 ? Math.sin(p * Math.PI) : 0;
  });

  if (!fx || !visible) return null;
  return (
    <group>
      <mesh geometry={fx.crackGeo} material={fx.crackMat} renderOrder={5} />
      <mesh geometry={fx.sheenGeo} material={fx.sheenMat} renderOrder={6} />
    </group>
  );
}

// ——— Fondo: estudio oscuro afuera, "día" al mirar desde adentro ———
const backdropShader = {
  uniforms: {
    topA: { value: new THREE.Color('#1b2228') },
    botA: { value: new THREE.Color('#07090b') },
    topB: { value: new THREE.Color('#dbe4ea') },
    botB: { value: new THREE.Color('#9aa6ae') },
    mixB: { value: 0 },
  },
  vertexShader: /* glsl */ `varying vec3 vPos; void main(){ vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: /* glsl */ `uniform vec3 topA; uniform vec3 botA; uniform vec3 topB; uniform vec3 botB; uniform float mixB; varying vec3 vPos;
    void main(){ float h = clamp(normalize(vPos).y * 0.5 + 0.5, 0.0, 1.0); vec3 a = mix(botA, topA, smoothstep(0.5, 1.0, h)); vec3 b = mix(botB, topB, smoothstep(0.4, 0.8, h)); gl_FragColor = vec4(mix(a, b, mixB), 1.0); }`,
};

const FLOOR_DARK = new THREE.Color('#07090b');
const FLOOR_DAY = new THREE.Color('#5f676d');

function Stage({ day, hidden, instant }: { day: boolean; hidden: boolean; instant?: boolean }) {
  const mat = useMemo(() => new THREE.ShaderMaterial({ ...backdropShader, side: THREE.BackSide, depthWrite: false }), []);
  const floor = useMemo(() => new THREE.MeshStandardMaterial({ color: '#07090b', roughness: 0.95, metalness: 0 }), []);
  // Disco de luz suave bajo el auto (se funde con el fondo)
  const spot = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, 'rgba(70,78,86,0.9)');
    g.addColorStop(0.55, 'rgba(40,46,52,0.45)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false });
  }, []);
  useLayoutEffect(() => {
    if (instant) {
      mat.uniforms.mixB.value = day ? 1 : 0;
      floor.color.lerpColors(FLOOR_DARK, FLOOR_DAY, day ? 1 : 0);
    }
  }, [instant, day, mat, floor]);
  useFrame((s, dt) => {
    const target = day ? 1 : 0;
    const u = mat.uniforms.mixB;
    if (Math.abs(u.value - target) > 0.002) {
      u.value += (target - u.value) * (1 - Math.exp(-Math.min(dt, 0.05) * 5));
      floor.color.lerpColors(FLOOR_DARK, FLOOR_DAY, u.value);
      s.invalidate();
    } else u.value = target;
  });
  if (hidden) return null;
  return (
    <group>
      <mesh material={mat} scale={40} renderOrder={-1}>
        <sphereGeometry args={[1, 32, 16]} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} material={floor} renderOrder={-1}>
        <circleGeometry args={[39, 64]} />
      </mesh>
      {spot && (
        <mesh rotation-x={-Math.PI / 2} position-y={0.002} material={spot}>
          <planeGeometry args={[11, 11]} />
        </mesh>
      )}
      {/* Anillo amarillo de acento en el piso */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.004}>
        <ringGeometry args={[3.55, 3.6, 128]} />
        <meshBasicMaterial color="#f0b331" toneMapped={false} />
      </mesh>
    </group>
  );
}

// ——— Control de cámara por vista ———
function Rig({
  state,
  active,
  reducedMotion,
  isTouch,
  autoRotateRef,
  onUserInteract,
  apiRef,
  capture,
}: {
  state: SimState;
  active: boolean;
  reducedMotion: boolean;
  isTouch: boolean;
  autoRotateRef: MutableRefObject<boolean>;
  onUserInteract?: () => void;
  apiRef?: MutableRefObject<SceneApi | null>;
  capture?: CaptureConfig;
}) {
  const ctl = useRef<CameraControlsImpl>(null);
  const { invalidate } = useThree();
  const token = useRef(0);

  // Configuración de entrada: sin paneo, sin rueda (no traba el scroll)
  useLayoutEffect(() => {
    const c = ctl.current;
    if (!c) return;
    c.mouseButtons.left = ACTION.ROTATE;
    c.mouseButtons.middle = ACTION.NONE;
    c.mouseButtons.right = ACTION.NONE;
    c.mouseButtons.wheel = ACTION.NONE;
    c.touches.one = ACTION.TOUCH_ROTATE;
    c.touches.two = ACTION.TOUCH_DOLLY;
    c.touches.three = ACTION.NONE;
    c.smoothTime = reducedMotion ? 0.05 : 0.35;
    c.draggingSmoothTime = 0.1;
    c.azimuthRotateSpeed = isTouch ? 0.8 : 0.7;
    c.polarRotateSpeed = 0.5;
    c.dollySpeed = 0.6;
    const onStart = () => {
      autoRotateRef.current = false;
      onUserInteract?.();
    };
    c.addEventListener('controlstart', onStart);
    return () => c.removeEventListener('controlstart', onStart);
  }, [reducedMotion, isTouch, autoRotateRef, onUserInteract]);

  useEffect(() => {
    if (!apiRef) return;
    apiRef.current = {
      rotate: (az, pol) => {
        autoRotateRef.current = false;
        ctl.current?.rotate(az, pol, !reducedMotion);
        invalidate();
      },
      zoom: (d) => {
        autoRotateRef.current = false;
        ctl.current?.dolly(d, !reducedMotion);
        invalidate();
      },
    };
  }, [apiRef, reducedMotion, invalidate, autoRotateRef]);

  // Captura: cámara fija por toma
  useLayoutEffect(() => {
    const c = ctl.current;
    if (!c || !capture) return;
    if (capture.shot === 'interior') {
      c.minDistance = 0;
      c.setLookAt(DRIVER_EYE.x, DRIVER_EYE.y, DRIVER_EYE.z, DRIVER_LOOK.x, DRIVER_LOOK.y, DRIVER_LOOK.z, false);
    } else if (capture.shot === 'windshield') {
      c.setLookAt(0.55, 2.25, 3.7, 0.12, 1.08, 0.8, false);
    } else {
      const i = Number(capture.shot.replace('a', '')) || 0;
      const p = spherical(THREE.MathUtils.degToRad(CAPTURE_AZIMUTHS[i]), EXT_POLAR, EXT_DISTANCE);
      c.setLookAt(p.x, p.y, p.z, EXT_TARGET.x, EXT_TARGET.y, EXT_TARGET.z, false);
    }
  }, [capture]);

  // Transiciones entre vistas
  useEffect(() => {
    const c = ctl.current;
    if (!c || capture) return;
    const my = ++token.current;
    const anim = !reducedMotion;
    const unlock = () => {
      c.minDistance = 0;
      c.maxDistance = Infinity;
      c.minPolarAngle = 0;
      c.maxPolarAngle = Math.PI;
      c.minAzimuthAngle = -Infinity;
      c.maxAzimuthAngle = Infinity;
    };
    (async () => {
      invalidate();
      if (state.view === 'exterior') {
        unlock();
        c.touches.two = ACTION.TOUCH_DOLLY;
        const az = THREE.MathUtils.degToRad(35);
        const p = spherical(az, EXT_POLAR, EXT_DISTANCE);
        if (c.distance < 1.5) {
          // salir del auto por la ventanilla del conductor
          await c.setLookAt(2.6, 1.2, 0.1, DRIVER_EYE.x, DRIVER_EYE.y, DRIVER_EYE.z, anim);
        }
        if (my !== token.current) return;
        await c.setLookAt(p.x, p.y, p.z, EXT_TARGET.x, EXT_TARGET.y, EXT_TARGET.z, anim);
        if (my !== token.current) return;
        c.minDistance = 4.2;
        c.maxDistance = 8.5;
        c.minPolarAngle = THREE.MathUtils.degToRad(40); // no se ve desde arriba del todo
        c.maxPolarAngle = THREE.MathUtils.degToRad(86); // ni por debajo del piso
      } else if (state.view === 'interior') {
        autoRotateRef.current = false;
        unlock();
        c.touches.two = ACTION.NONE;
        // entrar por la ventanilla del conductor
        await c.setLookAt(2.6, 1.2, 0.1, DRIVER_EYE.x, DRIVER_EYE.y, DRIVER_EYE.z, anim);
        if (my !== token.current) return;
        await c.setLookAt(DRIVER_EYE.x, DRIVER_EYE.y, DRIVER_EYE.z, DRIVER_LOOK.x, DRIVER_LOOK.y, DRIVER_LOOK.z, anim);
        if (my !== token.current) return;
        c.normalizeRotations();
        const d = c.distance;
        c.minDistance = d;
        c.maxDistance = d;
        c.minAzimuthAngle = Math.PI - 1.75; // mirar alrededor con límites
        c.maxAzimuthAngle = Math.PI + 1.75;
        c.minPolarAngle = THREE.MathUtils.degToRad(62);
        c.maxPolarAngle = THREE.MathUtils.degToRad(112);
      } else {
        autoRotateRef.current = false;
        unlock();
        c.touches.two = ACTION.TOUCH_DOLLY;
        if (c.distance < 1.5) await c.setLookAt(2.6, 1.2, 0.1, DRIVER_EYE.x, DRIVER_EYE.y, DRIVER_EYE.z, anim);
        if (my !== token.current) return;
        await c.setLookAt(0.55, 2.25, 3.7, 0.12, 1.08, 0.8, anim);
        if (my !== token.current) return;
        c.normalizeRotations();
        const az = c.azimuthAngle;
        c.minAzimuthAngle = az - 0.6;
        c.maxAzimuthAngle = az + 0.6;
        c.minDistance = 2.2;
        c.maxDistance = 4.6;
        c.minPolarAngle = THREE.MathUtils.degToRad(35);
        c.maxPolarAngle = THREE.MathUtils.degToRad(80);
      }
      invalidate();
    })();
  }, [state.view, reducedMotion, invalidate, autoRotateRef, capture]);

  // Campo de visión más amplio adentro del auto
  useFrame((s, dt) => {
    const cam = s.camera as THREE.PerspectiveCamera;
    const inside = capture ? capture.shot === 'interior' : state.view === 'interior' && (ctl.current?.distance ?? 9) < 1;
    const target = inside ? fovFor(FOV_INTERIOR, 80, s.size.width / s.size.height) : fovFor(FOV_EXTERIOR, 52, s.size.width / s.size.height);
    if (Math.abs(cam.fov - target) > 0.05) {
      cam.fov += (target - cam.fov) * (capture ? 1 : 1 - Math.exp(-Math.min(dt, 0.05) * 5));
      cam.updateProjectionMatrix();
      s.invalidate();
    }
  });

  // Rotación automática leve hasta que el usuario interactúa
  useFrame((s, dt) => {
    if (capture || !active || !autoRotateRef.current || reducedMotion || state.view !== 'exterior') return;
    ctl.current?.rotate(Math.min(dt, 0.05) * 0.22, 0, false);
    s.invalidate();
  });

  return <CameraControls ref={ctl} makeDefault />;
}

// ——— Señal de "listo" para la captura de imágenes ———
function CaptureReady({ capture }: { capture?: CaptureConfig }) {
  const frames = useRef(0);
  useFrame(() => {
    if (!capture) return;
    frames.current++;
    if (frames.current === 20) (window as unknown as { __simReady: boolean }).__simReady = true;
  });
  return null;
}

export default function CarScene({ modelUrl, state, active, interactive, isTouch, reducedMotion, onReady, onUserInteract, apiRef, capture }: Props) {
  const autoRotate = useRef(!capture);
  const [wsMesh, setWsMesh] = useState<THREE.Mesh | null>(null);
  const handleLoaded = useCallback(
    (m: CarMaterials) => {
      setWsMesh(m.windshieldMesh);
      onReady?.();
    },
    [onReady],
  );
  const isMask = capture?.layer === 'mask-side' || capture?.layer === 'mask-ws';
  const day = state.view === 'interior' || capture?.shot === 'interior';

  return (
    <Canvas
      frameloop={capture ? 'always' : 'demand'}
      dpr={capture ? 1 : isTouch ? [1, 1.5] : [1, 2]}
      camera={{ fov: 38, near: 0.02, far: 120, position: [5, 2, 5] }}
      gl={{ antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: !!capture, alpha: false }}
      style={{ pointerEvents: interactive ? 'auto' : 'none', touchAction: interactive ? 'none' : 'pan-y' }}
      aria-hidden
    >
      <color attach="background" args={[isMask ? '#000000' : '#0c1014']} />
      <Suspense fallback={null}>
        <Car
          url={modelUrl}
          state={state}
          capture={capture}
          onLoaded={handleLoaded}
        />
        {!isMask && (
          <>
            <WindshieldFx mesh={wsMesh} mode={state.windshield} visible={state.view === 'windshield' && !capture} exportMeta={capture?.shot === 'windshield'} />
            <ContactShadows position={[0, 0.01, 0]} opacity={0.8} scale={9} blur={2.4} far={1.6} resolution={512} frames={1} color="#000000" />
            <Environment resolution={256} frames={1} environmentIntensity={1.25}>
              <Lightformer form="rect" intensity={2.4} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[10, 5, 1]} />
              <Lightformer form="rect" intensity={1.3} position={[-6, 2, 1]} rotation-y={Math.PI / 2} scale={[9, 2, 1]} />
              <Lightformer form="rect" intensity={1.3} position={[6, 2, -1]} rotation-y={-Math.PI / 2} scale={[9, 2, 1]} />
              <Lightformer form="rect" intensity={1.8} position={[0, 2.5, 7]} rotation-y={Math.PI} scale={[10, 1.2, 1]} />
              <Lightformer form="rect" color="#f0b331" intensity={1.6} position={[0, 1.4, -8]} scale={[7, 0.5, 1]} />
              <Lightformer form="ring" color="#f0b331" intensity={1.2} position={[5, 3, 7]} scale={2} />
            </Environment>
          </>
        )}
        <CaptureReady capture={capture} />
      </Suspense>
      {!isMask && <ambientLight intensity={0.5} />}
      {!isMask && <directionalLight position={[4, 7, 3]} intensity={1.3} />}
      {!isMask && <directionalLight position={[-5, 3, -4]} intensity={0.9} color="#cfd8e0" />}
      {/* luz suave en la cabina: el interior se ve a través de los vidrios y el polarizado se nota */}
      {!isMask && <pointLight position={[0, 1.25, 0.1]} intensity={0.9} distance={2.6} decay={2} />}
      <Stage day={day} hidden={isMask} instant={!!capture} />
      <Rig
        state={state}
        active={active}
        reducedMotion={reducedMotion}
        isTouch={isTouch}
        autoRotateRef={autoRotate}
        onUserInteract={onUserInteract}
        apiRef={apiRef}
        capture={capture}
      />
    </Canvas>
  );
}

