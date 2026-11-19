'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotionPref } from '@/components/ui/useMediaQuery';
import model from '@/data/model.json';
import { business } from '@/data/business';
import { SECURITY_FILM_TINT } from '@/data/options';
import { useQuote } from '@/components/quote/QuoteContext';
import { Reveal, SectionHeading } from '@/components/ui/Reveal';
import { IconArrowRight, IconChevronLeft, IconChevronRight, IconEye, IconRotate, IconWhatsApp, IconX } from '@/components/ui/Icons';
import { initialSimState, tintLabel, type SimState, type TintChoice } from './tint';
import type { CaptureConfig, SceneApi } from './CarScene';
import { Fallback2D } from './Fallback2D';

const CarScene = dynamic(() => import('./CarScene'), { ssr: false });

type Mode = 'idle' | 'loading' | '3d' | 'fallback';

/** ¿Conviene la versión 3D? Sin WebGL, poca memoria/CPU, ahorro de datos o render por software → versión liviana. */
function detect3D(): { ok: boolean; reason?: string } {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('sim') === '2d') return { ok: false, reason: 'forzado' };
    if (params.get('sim') === '3d') return { ok: true };
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) return { ok: false, reason: 'sin WebGL' };
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    if (/swiftshader|llvmpipe|software/i.test(renderer)) return { ok: false, reason: 'render por software' };
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) return { ok: false, reason: 'ahorro de datos' };
    if (nav.deviceMemory && nav.deviceMemory <= 2) return { ok: false, reason: 'poca memoria' };
    if (nav.hardwareConcurrency && nav.hardwareConcurrency <= 2) return { ok: false, reason: 'CPU limitada' };
    return { ok: true };
  } catch {
    return { ok: false, reason: 'error' };
  }
}

/** Descarga el modelo con progreso real y devuelve una URL local (blob). */
async function downloadModel(onProgress: (p: number) => void): Promise<string> {
  const res = await fetch(model.url);
  if (!res.ok || !res.body) throw new Error('No se pudo descargar el modelo');
  const encoded = !!res.headers.get('content-encoding');
  const total = (!encoded && Number(res.headers.get('content-length'))) || model.bytes;
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    onProgress(Math.min(0.99, received / total));
  }
  onProgress(1);
  return URL.createObjectURL(new Blob(chunks as BlobPart[], { type: 'model/gltf-binary' }));
}

function useCaptureConfig(): CaptureConfig | null {
  const [cfg, setCfg] = useState<CaptureConfig | null>(null);
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const shot = p.get('sim-render');
    if (shot) setCfg({ shot, layer: (p.get('layer') as CaptureConfig['layer']) || 'base' });
  }, []);
  return cfg;
}

export function SimulatorSection() {
  const { openQuote } = useQuote();
  const reduced = useReducedMotionPref();
  const [state, setState] = useState<SimState>(initialSimState);
  const [mode, setMode] = useState<Mode>('idle');
  const [progress, setProgress] = useState(0);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [touchActive, setTouchActive] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const apiRef = useRef<SceneApi | null>(null);
  const capture = useCaptureConfig();

  useEffect(() => setIsTouch(window.matchMedia('(pointer: coarse)').matches), []);

  // Carga diferida: arranca cuando la sección se acerca al viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || mode !== 'idle') return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const d = detect3D();
        if (!d.ok) {
          setMode('fallback');
          return;
        }
        setMode('loading');
        import('./CarScene'); // precarga el código 3D en paralelo con el modelo
        downloadModel(setProgress)
          .then((url) => {
            setModelUrl(url);
            setMode('3d');
          })
          .catch(() => setMode('fallback'));
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mode]);

  // Captura (solo scripts/render-fallback.mjs): carga directa
  useEffect(() => {
    if (!capture) return;
    downloadModel(() => {}).then((url) => {
      setModelUrl(url);
      setMode('3d');
    });
    setState((s) => ({ ...s, tint: 'none' }));
  }, [capture]);

  // Render solo mientras la sección está visible (no consume batería fuera de pantalla)
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver((e) => setActive(e[0]?.isIntersecting ?? false), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const update = useCallback((patch: Partial<SimState>) => setState((s) => ({ ...s, ...patch })), []);
  const onUserInteract = useCallback(() => setInteracted(true), []);
  const onReady = useCallback(() => setReady(true), []);

  const interactive = mode === '3d' && (!isTouch || touchActive);
  const t = tintLabel(state.tint);

  const onStageKey = (e: React.KeyboardEvent) => {
    const api = apiRef.current;
    if (!api) return;
    const map: Record<string, [number, number]> = {
      ArrowLeft: [-0.25, 0],
      ArrowRight: [0.25, 0],
      ArrowUp: [0, -0.12],
      ArrowDown: [0, 0.12],
    };
    if (map[e.key]) {
      e.preventDefault();
      api.rotate(...map[e.key]);
      setInteracted(true);
    } else if (e.key === '+' || e.key === '=') api.zoom(0.8);
    else if (e.key === '-') api.zoom(-0.8);
  };

  if (capture) {
    return (
      <div className="fixed inset-0 z-[100] bg-black" data-capture>
        {modelUrl && <CarScene modelUrl={modelUrl} state={state} active interactive={false} isTouch={false} reducedMotion capture={capture} />}
      </div>
    );
  }

  return (
    <section ref={sectionRef} id="simulador" aria-labelledby="simulador-title" className="cut-both relative bg-carbon py-[calc(3.5vw+4.5rem)]">
      <div className="hex-pattern pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="container-x relative">
        <SectionHeading
          id="simulador-title"
          eyebrow="Simulador 3D"
          title={
            <>
              Mirá cómo queda tu vehículo <span className="text-brand">con lámina de seguridad</span>
            </>
          }
          intro="Girá el vehículo, compará sin lámina y con la lámina de seguridad Security Film (20 %) y mirá desde el asiento del conductor. También podés ver cómo queda un parabrisas cambiado."
        />

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* Escenario */}
          <Reveal className="relative">
            <div
              ref={stageRef}
              tabIndex={mode === '3d' ? 0 : -1}
              role={mode === '3d' ? 'group' : undefined}
              aria-roledescription={mode === '3d' ? 'visor 3D' : undefined}
              aria-label={mode === '3d' ? `Vehículo en 3D: ${state.tint === 'none' ? 'sin lámina' : `con lámina de seguridad ${t.label}`}. Usá las flechas del teclado para girarlo y + o - para acercar.` : undefined}
              onKeyDown={onStageKey}
              className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-ink sm:aspect-[16/11]"
            >
              {mode === '3d' && modelUrl && (
                <div className="absolute inset-0">
                  <CarScene
                    modelUrl={modelUrl}
                    state={state}
                    active={active}
                    interactive={interactive}
                    isTouch={isTouch}
                    reducedMotion={reduced}
                    onReady={onReady}
                    onUserInteract={onUserInteract}
                    apiRef={apiRef}
                  />
                </div>
              )}

              {mode === 'fallback' && <Fallback2D state={state} onChange={update} />}

              {/* Vista previa + progreso real mientras carga */}
              {(mode === 'idle' || mode === 'loading' || (mode === '3d' && !ready)) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/sim/a0-base.webp" alt="" className="absolute inset-0 h-full w-full object-cover opacity-25 blur-[1px]" loading="lazy" />
                  <div className="relative w-2/3 max-w-xs text-center">
                    <p className="font-display text-xl font-bold tracking-wide uppercase">Cargando simulador…</p>
                    <div
                      className="mt-3 h-2 overflow-hidden rounded-full bg-steel"
                      role="progressbar"
                      aria-label="Progreso de carga del modelo 3D"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(progress * 100)}
                    >
                      <div className="h-full rounded-full bg-brand transition-[width] duration-200" style={{ width: `${Math.max(4, progress * 100)}%` }} />
                    </div>
                    <p className="mt-2 text-sm font-semibold text-snow">{Math.round(progress * 100)} %</p>
                  </div>
                </div>
              )}

              {/* Mobile: el canvas no captura el scroll hasta que se activa */}
              {mode === '3d' && ready && isTouch && !touchActive && (
                <button
                  type="button"
                  onClick={() => {
                    setTouchActive(true);
                    setInteracted(true);
                  }}
                  className="absolute inset-0 flex items-end justify-center pb-6"
                  aria-label="Activar el visor 3D para girar el vehículo con el dedo"
                >
                  <span className="inline-flex min-h-12 items-center gap-2 rounded-full bg-ink/85 px-5 py-3 font-display text-lg font-bold uppercase tracking-wide text-snow ring-1 ring-brand/70 backdrop-blur">
                    <IconRotate className="h-5 w-5 text-brand" /> Tocá para girar el vehículo
                  </span>
                </button>
              )}
              {mode === '3d' && isTouch && touchActive && (
                <button
                  type="button"
                  onClick={() => setTouchActive(false)}
                  className="absolute top-3 right-3 inline-flex min-h-11 items-center gap-1 rounded-full bg-ink/85 px-4 font-semibold ring-1 ring-line backdrop-blur"
                >
                  <IconX className="h-5 w-5" /> Listo
                </button>
              )}

              {/* Etiqueta del tono */}
              {(mode === '3d' || mode === 'fallback') && (
                <div className="pointer-events-none absolute top-3 left-3 rounded-xl bg-ink/80 px-3 py-2 backdrop-blur" aria-live="polite">
                  <p className="font-display text-2xl leading-none font-bold text-brand">{t.label}</p>
                  <p className="text-sm font-semibold">{t.short}</p>
                </div>
              )}

              {/* Ayuda + zoom (desktop) */}
              {mode === '3d' && ready && !isTouch && (
                <>
                  {!interacted && state.view === 'exterior' && (
                    <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ink/80 px-4 py-2 text-sm whitespace-nowrap backdrop-blur">
                      Arrastrá para girar · Flechas del teclado
                    </p>
                  )}
                  <div className="absolute right-3 bottom-3 flex flex-col gap-2">
                    <button type="button" className="h-11 w-11 rounded-full bg-ink/85 text-xl font-bold ring-1 ring-line hover:ring-brand" onClick={() => apiRef.current?.zoom(0.9)} aria-label="Acercar">
                      +
                    </button>
                    <button type="button" className="h-11 w-11 rounded-full bg-ink/85 text-xl font-bold ring-1 ring-line hover:ring-brand" onClick={() => apiRef.current?.zoom(-0.9)} aria-label="Alejar">
                      −
                    </button>
                  </div>
                </>
              )}
              {mode === '3d' && ready && (isTouch ? touchActive : true) && state.view !== 'interior' && (
                <div className={`absolute bottom-3 flex gap-2 ${isTouch ? 'left-3' : 'left-3 hidden sm:flex'}`}>
                  <button type="button" className="h-11 w-11 rounded-full bg-ink/85 ring-1 ring-line hover:ring-brand" onClick={() => apiRef.current?.rotate(-0.5, 0)} aria-label="Girar a la izquierda">
                    <IconChevronLeft className="mx-auto" />
                  </button>
                  <button type="button" className="h-11 w-11 rounded-full bg-ink/85 ring-1 ring-line hover:ring-brand" onClick={() => apiRef.current?.rotate(0.5, 0)} aria-label="Girar a la derecha">
                    <IconChevronRight className="mx-auto" />
                  </button>
                </div>
              )}
            </div>
            <p className="mt-2 text-xs text-mist">
              Representación aproximada.{' '}
              <a href={business.modelCredit.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-snow">
                {business.modelCredit.text}
              </a>
              {mode === 'fallback' && ' · Versión liviana con imágenes para tu dispositivo.'}
            </p>
          </Reveal>

          {/* Controles */}
          <Reveal delay={0.08} className="card flex flex-col gap-6 p-5 sm:p-6">
            <div>
              <h3 id="tono-label" className="font-display text-xl font-bold uppercase tracking-wide">
                Lámina de seguridad
              </h3>
              <div role="radiogroup" aria-labelledby="tono-label" className="mt-3 grid gap-2 min-[420px]:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {(['none', SECURITY_FILM_TINT.value] as TintChoice[]).map((v) => (
                  <button
                    key={v}
                    type="button"
                    role="radio"
                    aria-checked={state.tint === v}
                    className="chip justify-center text-center"
                    onClick={() => update({ tint: v })}
                  >
                    {v === 'none' ? 'Sin lámina' : `Con lámina de seguridad (${SECURITY_FILM_TINT.label})`}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[0.97rem] text-mist">
                <strong className="text-snow">{t.short}.</strong> {t.description}
              </p>
            </div>


            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {state.view === 'interior' ? (
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => update({ view: 'exterior' })}>
                  <IconArrowRight className="h-5 w-5 rotate-180" /> Volver afuera
                </button>
              ) : (
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => update({ view: 'interior' })} disabled={mode !== '3d' && mode !== 'fallback'}>
                  <IconEye className="h-5 w-5" /> Ver desde adentro
                </button>
              )}
              {state.view === 'windshield' ? (
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => update({ view: 'exterior', windshield: 'antes' })}>
                  <IconArrowRight className="h-5 w-5 rotate-180" /> Volver al vehículo
                </button>
              ) : (
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => update({ view: 'windshield', windshield: 'antes' })} disabled={mode !== '3d' && mode !== 'fallback'}>
                  Parabrisas antes / después
                </button>
              )}
            </div>

            {state.view === 'windshield' && (
              <div className="rounded-xl border border-brand/40 bg-brand/[0.05] p-4">
                <div role="radiogroup" aria-label="Estado del parabrisas" className="flex gap-2">
                  <button type="button" role="radio" aria-checked={state.windshield === 'antes'} className="chip flex-1" onClick={() => update({ windshield: 'antes' })}>
                    Antes
                  </button>
                  <button type="button" role="radio" aria-checked={state.windshield === 'despues'} className="chip flex-1" onClick={() => update({ windshield: 'despues' })}>
                    Después
                  </button>
                </div>
                <p className="mt-3 font-display text-lg font-bold uppercase tracking-wide" aria-live="polite">
                  {state.windshield === 'antes' ? 'Rajadura por impacto' : <span className="text-brand">Parabrisas nuevo · cambio {business.replacementTime}</span>}
                </p>
              </div>
            )}

            <div className="mt-auto">
              <button
                type="button"
                className="btn btn-primary w-full text-xl"
                aria-haspopup="dialog"
                onClick={() =>
                  openQuote({
                    service: 'Láminas de seguridad',
                    glassScope: 'todos',
                    source: 'simulador',
                  })
                }
              >
                <IconWhatsApp className="h-6 w-6" /> Quiero mi lámina de seguridad
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
