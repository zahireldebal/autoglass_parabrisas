import type { SVGProps } from 'react';
import { securityFilm, SECURITY_FILM_WHATSAPP } from '@/data/securityFilm';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { Reveal } from '@/components/ui/Reveal';
import { IconWhatsApp } from '@/components/ui/Icons';

/**
 * Sección de la marca Security Film. Usa SOLO la paleta de la marca
 * (negro, blanco y azul #0173C7, ver SF_COLORS) para diferenciarse del resto del sitio.
 */

type P = SVGProps<SVGSVGElement>;

/** Isotipo de Security Film: cuatro paños en perspectiva, reconstruido en vector a partir de la ficha. */
export function SecurityFilmMark(p: P) {
  return (
    <svg viewBox="0 0 142 128" fill="currentColor" aria-hidden focusable={false} {...p}>
      <polygon points="0,19 56,11.9 56,59 0,59" />
      <polygon points="68,10.3 142,0.8 142,59 68,59" />
      <polygon points="0,71 56,71 56,116.4 0,109" />
      <polygon points="68,71 142,71 142,127.4 68,117.9" />
    </svg>
  );
}

export function SecurityFilmLogo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex flex-col items-center gap-2 ${className}`} role="img" aria-label="Logo de Security Film">
      <SecurityFilmMark className="h-auto w-full text-sf-blue" />
      <span className="font-sans text-[1.35em] leading-none font-bold whitespace-nowrap text-white">Security Film</span>
    </span>
  );
}

// ——— Íconos de línea (mismo trazo que los de la ficha) ———
const line = (p: P) => ({
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
  ...p,
});
const Rays = () => (
  <path d="M12 1.5v2M12 20.5v2M1.5 12h2M20.5 12h2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M4.6 19.4 6 18M18 6l1.4-1.4" />
);
const SPEC_ICONS: Record<string, (p: P) => React.ReactElement> = {
  espesor: (p) => (
    <svg {...line(p)}>
      <path d="m12 3 9 4.5-9 4.5-9-4.5L12 3Z" />
      <path d="m3 12 9 4.5 9-4.5M3 16.5 12 21l9-4.5" />
    </svg>
  ),
  uv: (p) => (
    <svg {...line(p)}>
      <Rays />
      <circle cx="12" cy="12" r="6" />
      <text x="12" y="14.2" textAnchor="middle" fontSize="5.6" fontWeight="700" fill="currentColor" stroke="none" fontFamily="sans-serif">
        UV
      </text>
    </svg>
  ),
  luz: (p) => (
    <svg {...line(p)}>
      <path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12Z" />
      <circle cx="12" cy="12" r="3.2" />
    </svg>
  ),
  ir: (p) => (
    <svg {...line(p)}>
      <Rays />
      <circle cx="12" cy="12" r="6" />
      <text x="12" y="14.2" textAnchor="middle" fontSize="5.8" fontWeight="700" fill="currentColor" stroke="none" fontFamily="sans-serif">
        IR
      </text>
    </svg>
  ),
  calor: (p) => (
    <svg {...line(p)}>
      <path d="M14 14.8V4a2 2 0 0 0-4 0v10.8a4 4 0 1 0 4 0Z" />
      <path d="M12 9v7" />
      <path d="M4 7.5a3 3 0 0 0 0 5M2.5 5 4 6.5M2.5 15 4 13.5" />
    </svg>
  ),
  fragmentos: (p) => (
    <svg {...line(p)}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m12 6-1.5 4 2.5 1.5-2 5" />
    </svg>
  ),
  transparencia: (p) => (
    <svg {...line(p)}>
      <path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12Z" />
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3v-1.5M5 5.5 4 4.5M19 5.5l1-1" />
    </svg>
  ),
  uso: (p) => (
    <svg {...line(p)}>
      <path d="M3 21V5h6v16M9 9h4v4" />
      <path d="M5.5 8h1M5.5 11h1M5.5 14h1" />
      <path d="M11 21v-3.5l1.5-3h7l1.5 3V21M11 18.5h10" />
      <circle cx="13.5" cy="20" r="0.4" fill="currentColor" />
      <circle cx="18.5" cy="20" r="0.4" fill="currentColor" />
    </svg>
  ),
};

const IconCheckCircle = (p: P) => (
  <svg {...line(p)} strokeWidth={2}>
    <path d="M21 11.5V12a9 9 0 1 1-5.3-8.2" />
    <path d="m8 11.5 3.5 3.5L22 4" />
  </svg>
);

export function SecurityFilm() {
  const sf = securityFilm;
  return (
    <section
      id="security-film"
      aria-labelledby="security-film-title"
      className="relative overflow-hidden border-y border-sf-blue/40 bg-black py-20 text-white sm:py-28"
    >
      {/* Reflejo azul sutil, como un vidrio */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-sf-blue/15 blur-3xl"
      />
      <div className="container-x relative">
        {/* Encabezado de marca */}
        <Reveal className="flex flex-col gap-8 sm:flex-row sm:items-center">
          <SecurityFilmLogo className="w-32 shrink-0 text-[0.9rem] sm:w-40 sm:text-base" />
          <div className="sm:border-l sm:border-sf-blue sm:pl-8">
            <p className="font-display text-sm font-bold tracking-[0.3em] text-white/75 uppercase">Láminas de seguridad</p>
            <h2 id="security-film-title" className="mt-2 font-sans text-5xl leading-none font-extrabold tracking-tight uppercase sm:text-6xl lg:text-7xl">
              {sf.name}
            </h2>
            <p className="mt-3 text-sm tracking-[0.32em] text-balance text-white/85 uppercase sm:text-base">{sf.subtitle}</p>
            <div className="mt-4 h-px w-full max-w-xl bg-sf-blue" aria-hidden />
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <p className="mt-8 max-w-3xl text-lg text-white/85">
            Privacidad, protección y seguridad para tu vehículo. Mucho más que un tono: la lámina{' '}
            <strong className="text-white">mantiene el vidrio unido ante un impacto y dificulta el ingreso al vehículo</strong>.
          </p>
        </Reveal>

        {/* Datos destacados */}
        <Reveal delay={0.08}>
          <ul className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-sf-blue/50 bg-sf-blue/50 sm:grid-cols-3 lg:grid-cols-5">
            {sf.highlights.map((h, i) => (
              <li key={h.label} className={`bg-black p-5 text-center ${i === sf.highlights.length - 1 ? 'col-span-2 sm:col-span-1' : ''}`}>
                <p className="font-sans text-4xl leading-none font-extrabold text-white sm:text-5xl">{h.value}</p>
                <p className="mt-2 text-sm font-semibold tracking-wide text-white/75 uppercase">{h.label}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Especificaciones y beneficios */}
        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h3 className="border-b border-sf-blue pb-3 font-sans text-2xl font-bold tracking-wide text-sf-blue uppercase">Especificaciones</h3>
            <ul className="mt-6 grid gap-5">
              {sf.specs.map((s) => {
                const Icon = SPEC_ICONS[s.id];
                return (
                  <li key={s.id} className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center text-white">{Icon && <Icon className="h-9 w-9" />}</span>
                    <div>
                      <p className="font-bold tracking-wide uppercase">{s.label}</p>
                      <p className="text-white/80 uppercase">{s.value}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <Reveal delay={0.08} className="lg:border-l lg:border-sf-blue/60 lg:pl-16">
            <h3 className="border-b border-sf-blue pb-3 font-sans text-2xl font-bold tracking-wide text-sf-blue uppercase">Beneficios</h3>
            <ul className="mt-6 grid gap-5">
              {sf.benefits.map((b) => (
                <li key={b} className="flex items-center gap-4 text-lg">
                  <IconCheckCircle className="h-8 w-8 shrink-0 text-sf-blue" /> {b}
                </li>
              ))}
            </ul>

            {/* Ficha del rollo */}
            <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/25 bg-white/25 sm:grid-cols-3">
              {sf.product.map((d) => (
                <div key={d.label} className="bg-black px-4 py-3 text-center">
                  <dt className="text-xs font-bold tracking-[0.15em] text-white/70 uppercase">{d.label}</dt>
                  <dd className="mt-1 font-sans text-lg font-bold">{d.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Sellos de la ficha */}
        <Reveal>
          <ul className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {sf.badges.map((b) => (
              <li
                key={b}
                className="flex min-h-16 items-center justify-center rounded-xl bg-gradient-to-b from-[#e9ecef] to-[#b9bfc5] px-3 py-3 text-center font-sans text-sm font-extrabold tracking-wide text-black uppercase sm:text-base"
              >
                {b}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center text-xs tracking-[0.4em] text-white/70 uppercase sm:text-sm">
            {sf.tagline.map((t, i) => (
              <span key={t}>
                {i > 0 && <span className="mx-2 text-sf-blue sm:mx-3">•</span>}
                {t}
              </span>
            ))}
          </p>
        </Reveal>

        {/* Mayorista + WhatsApp */}
        <Reveal className="mt-12">
          <div className="flex flex-col gap-6 rounded-2xl border-2 border-sf-blue bg-sf-blue/10 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-display text-sm font-bold tracking-[0.3em] text-white/75 uppercase">Talleres y particulares</p>
              <p className="mt-2 max-w-2xl font-sans text-2xl leading-snug font-bold sm:text-3xl">
                Comprá la lámina por mayor para tu taller, o vení y la colocamos en tu vehículo.
              </p>
            </div>
            <a
              href={buildWhatsAppUrl(SECURITY_FILM_WHATSAPP)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn shrink-0 bg-sf-blue text-white hover:bg-sf-blue-strong"
            >
              <IconWhatsApp className="h-6 w-6" /> Consultanos por Security Film
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
