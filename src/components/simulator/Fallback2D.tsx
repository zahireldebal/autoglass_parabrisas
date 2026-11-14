'use client';

/**
 * Versión liviana del simulador (sin WebGL o equipos de baja potencia):
 * renders del auto en 6 ángulos + interior + parabrisas, generados con
 * `npm run render:fallback`. El polarizado se aplica como una capa de color
 * recortada con una máscara de los vidrios.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import meta from '@/data/sim-meta.json';
import { IconChevronLeft, IconChevronRight } from '@/components/ui/Icons';
import { drawCrack } from './crack';
import { FILM_TINT_COLOR, glassOpacity, type SimState } from './tint';

const ANGLES = ['a0', 'a1', 'a2', 'a3', 'a4', 'a5'];
const BASE_OPACITY = glassOpacity('none'); // el render base ya tiene vidrio claro

/** Opacidad extra de la capa para llegar al tono pedido sobre el vidrio claro del render. */
function overlayAlpha(target: number) {
  return Math.max(0, 1 - (1 - target) / (1 - BASE_OPACITY));
}

function MaskLayer({ mask, color, alpha }: { mask: string; color: string; alpha: number }) {
  const url = `url(${mask})`;
  return (
    <div
      aria-hidden
      className="absolute inset-0 transition-[opacity,background-color] duration-500"
      style={{
        backgroundColor: color,
        opacity: alpha,
        WebkitMaskImage: url,
        maskImage: url,
        WebkitMaskSize: 'cover',
        maskSize: 'cover',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
      }}
    />
  );
}

export function Fallback2D({ state, onChange }: { state: SimState; onChange: (p: Partial<SimState>) => void }) {
  const [angle, setAngle] = useState(0);
  const [crackUrl, setCrackUrl] = useState<string | null>(null);
  const start = useRef<number | null>(null);

  const shot = state.view === 'interior' ? 'interior' : state.view === 'windshield' ? 'windshield' : ANGLES[angle];
  const sideTarget = glassOpacity(state.tint);
  const color = state.tint === 'none' ? FILM_TINT_COLOR.clear : FILM_TINT_COLOR[state.film];

  useEffect(() => {
    if (state.view === 'windshield' && !crackUrl) setCrackUrl(drawCrack(512).toDataURL('image/png'));
  }, [state.view, crackUrl]);

  // Precarga de los ángulos vecinos
  useEffect(() => {
    if (state.view !== 'exterior') return;
    for (const d of [-1, 1]) {
      const a = ANGLES[(angle + d + ANGLES.length) % ANGLES.length];
      const img = new Image();
      img.src = `/sim/${a}-base.webp`;
    }
  }, [angle, state.view]);

  const go = (d: number) => {
    if (state.view !== 'exterior') onChange({ view: 'exterior' });
    setAngle((a) => (a + d + ANGLES.length) % ANGLES.length);
  };

  const ws = meta.windshield;
  const crackStyle = useMemo(
    () => ({
      left: `${ws.x * 100}%`,
      top: `${ws.y * 100}%`,
      width: `${ws.r * 200}%`,
      transform: 'translate(-50%, -50%) scaleY(0.62)',
    }),
    [ws],
  );

  return (
    <div
      className="absolute inset-0 touch-pan-y select-none"
      tabIndex={0}
      role="group"
      aria-roledescription="visor de imágenes"
      aria-label="Auto con polarizado. Usá las flechas izquierda y derecha para girarlo."
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') go(-1);
        if (e.key === 'ArrowRight') go(1);
      }}
      onPointerDown={(e) => (start.current = e.clientX)}
      onPointerUp={(e) => {
        if (start.current === null) return;
        const dx = e.clientX - start.current;
        start.current = null;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/sim/${shot}-base.webp`} alt="" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      <MaskLayer mask={`/sim/${shot}-side.webp`} color={color} alpha={overlayAlpha(sideTarget)} />
      <MaskLayer mask={`/sim/${shot}-ws.webp`} color={color} alpha={state.includeWindshield ? overlayAlpha(sideTarget) : 0} />

      {state.view === 'windshield' && crackUrl && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={crackUrl}
            alt=""
            aria-hidden
            className="pointer-events-none absolute transition-opacity duration-700"
            style={{ ...crackStyle, opacity: state.windshield === 'antes' ? 0.9 : 0 }}
          />
          {state.windshield === 'despues' && (
            <div
              aria-hidden
              className="sheen-sweep pointer-events-none absolute inset-0"
              style={{
                WebkitMaskImage: `url(/sim/windshield-ws.webp)`,
                maskImage: `url(/sim/windshield-ws.webp)`,
                WebkitMaskSize: 'cover',
                maskSize: 'cover',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
              }}
            />
          )}
        </>
      )}

      {state.view === 'exterior' && (
        <div className="absolute right-3 bottom-3 flex gap-2">
          <button type="button" onClick={() => go(-1)} className="h-11 w-11 rounded-full bg-ink/85 ring-1 ring-line hover:ring-brand" aria-label="Ver el auto desde otro ángulo (anterior)">
            <IconChevronLeft className="mx-auto" />
          </button>
          <button type="button" onClick={() => go(1)} className="h-11 w-11 rounded-full bg-ink/85 ring-1 ring-line hover:ring-brand" aria-label="Ver el auto desde otro ángulo (siguiente)">
            <IconChevronRight className="mx-auto" />
          </button>
        </div>
      )}
    </div>
  );
}
