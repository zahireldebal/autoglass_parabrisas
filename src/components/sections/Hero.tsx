import { preload } from 'react-dom';
import { business } from '@/data/business';
import { Picture, imageSrc, imageSrcSet } from '@/components/ui/Picture';
import { IconArrowRight, IconShield, IconStar, IconWhatsApp } from '@/components/ui/Icons';
import { QuoteButton } from '@/components/quote/QuoteContext';

/** Foto de portada. Celular y tablet: franja a todo el ancho arriba del texto. Desktop: columna derecha. */
const HERO_IMG = 'hero-taller';
const HERO_SIZES = '(min-width: 1024px) 46vw, 100vw';

export function Hero() {
  // Precarga con prioridad alta (va al <head>): la foto empieza a bajar antes que el CSS y el JS.
  preload(imageSrc(HERO_IMG), { as: 'image', imageSrcSet: imageSrcSet(HERO_IMG), imageSizes: HERO_SIZES, fetchPriority: 'high' });
  return (
    <section id="inicio" aria-labelledby="hero-title" className="cut-bottom relative overflow-hidden bg-ink">
      {/* Foto real de un trabajo: en celular y tablet va arriba, limpia y sin texto encima; en desktop, a la derecha */}
      {/* Desktop: .hero-media corta la foto en diagonal y su fondo amarillo asoma como la línea del borde (ver globals.css) */}
      <div className="hero-media relative h-[50svh] min-h-[20rem] overflow-hidden lg:absolute lg:inset-0 lg:left-auto lg:h-auto lg:min-h-0 lg:w-[46%]">
        <div className="hero-media-photo absolute inset-0 overflow-hidden">
          <Picture
            name={HERO_IMG}
            alt="Técnico de Autoglass con la remera del taller aplicando sellador en el marco del parabrisas de un vehículo blanco, en el taller de Maldonado"
            sizes={HERO_SIZES}
            priority
            className="hero-photo h-full w-full object-cover object-[50%_42%] lg:object-[50%_38%]"
          />
          {/* Celular: la foto queda limpia; solo se funde abajo con el fondo (donde empieza el texto) y un toque arriba,
              detrás del menú. Desktop: sombra suave desde la línea hacia la foto, para darle profundidad. */}
          <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--color-ink)_0%,transparent_32%,transparent_80%,rgb(12_16_20/0.45)_100%)] lg:bg-[linear-gradient(to_right,rgb(12_16_20/0.55)_0%,transparent_22%),linear-gradient(to_bottom,rgb(12_16_20/0.5)_0%,transparent_7rem)]" />
        </div>
      </div>

      <div className="container-x relative -mt-6 flex flex-col pb-[calc(3.5vw+3.5rem)] lg:mt-0 lg:min-h-[44rem] lg:justify-center lg:pt-28">
        <div className="max-w-2xl lg:max-w-[47%]">
          <p className="hero-in eyebrow" style={{ animationDelay: '0.05s' }}>
            Importador directo · {business.city}
          </p>
          <h1 id="hero-title" className="h-display mt-4 text-[2.6rem] min-[400px]:text-[2.9rem] sm:text-6xl lg:text-[4.4rem]">
            Tu vehículo, <span className="text-brand">en las mejores manos.</span>
          </h1>
          {/* Subtítulo en texto real: lleva las palabras clave que ya no están en el H1 */}
          <p className="hero-in mt-6 font-display text-2xl leading-tight font-bold tracking-wide text-snow uppercase sm:text-3xl" style={{ animationDelay: '0.14s' }}>
            Cristales automotrices y <span className="text-brand">láminas de seguridad</span> para tu vehículo
          </p>
          <p className="hero-in mt-2 max-w-xl text-lg text-snow/90 sm:text-xl" style={{ animationDelay: '0.2s' }}>
            Importamos, vendemos y colocamos cristales para autos, camionetas y camiones.{' '}
            <strong className="font-semibold text-snow">Colocación sin costo con la compra del cristal</strong> y servicio a domicilio sin cargo en{' '}
            {business.homeServiceZones.join(', ').replace(/, ([^,]*)$/, ' y $1')}.
          </p>

          {/* Sello destacado: seguro */}
          <a
            href="#seguros"
            className="hero-in group mt-6 inline-flex max-w-xl items-center gap-3 rounded-2xl border-2 border-brand bg-brand/10 py-3 pr-5 pl-3 transition-colors hover:bg-brand/20"
            style={{ animationDelay: '0.24s' }}
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand text-ink">
              <IconShield className="h-7 w-7" />
            </span>
            <span className="font-display text-xl leading-tight font-bold tracking-wide text-snow uppercase sm:text-2xl">
              Tu parabrisas <span className="text-brand">gratis</span> con el seguro de tu vehículo
            </span>
            <IconArrowRight className="h-5 w-5 shrink-0 text-brand transition-transform group-hover:translate-x-1" />
          </a>

          <div className="hero-in mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: '0.28s' }}>
            <QuoteButton className="btn btn-primary text-xl">
              <IconWhatsApp className="h-6 w-6" /> Cotizá por WhatsApp
            </QuoteButton>
            <a href="#simulador" className="btn btn-outline">
              Probá el simulador <IconArrowRight className="h-5 w-5" />
            </a>
          </div>

          <ul className="hero-in mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-snow/85 sm:text-base" style={{ animationDelay: '0.36s' }}>
            <li className="flex items-center gap-2">
              <span className="flex text-brand" aria-hidden>
                {[0, 1, 2, 3, 4].map((i) => (
                  <IconStar key={i} className="h-4 w-4" />
                ))}
              </span>
              <a href="#opiniones" className="underline-offset-4 hover:underline">
                {business.google.rating.toString().replace('.', ',')} en Google · {business.google.reviewCount} reseñas
              </a>
            </li>
            <li className="flex items-center gap-2">
              <span className="stripe !w-5" aria-hidden /> Sin turno: cambio {business.replacementTime}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
