import { business } from '@/data/business';
import { Picture } from '@/components/ui/Picture';
import { IconArrowRight, IconShield, IconStar, IconWhatsApp } from '@/components/ui/Icons';
import { QuoteButton } from '@/components/quote/QuoteContext';

export function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="cut-bottom relative overflow-hidden bg-ink">
      {/* Fondo: foto real de un trabajo (en mobile ocupa todo; en desktop va a la derecha) */}
      <div className="absolute inset-0 lg:left-auto lg:w-[46%]">
        <Picture
          name="portada"
          alt="Técnico de Autoglass con la remera del taller trabajando sobre el parabrisas de un vehículo gris en el taller de Maldonado"
          sizes="(min-width: 1024px) 46vw, 100vw"
          priority
          className="h-full w-full object-cover object-[50%_35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/30 lg:bg-gradient-to-r lg:from-ink lg:via-ink/40 lg:to-transparent" />
        {/* Franja amarilla en el borde diagonal (desktop) */}
        <div className="absolute inset-y-0 -left-10 hidden w-24 origin-top -skew-x-[8deg] bg-ink lg:block" />
        <div className="absolute inset-y-0 left-[2.6rem] hidden w-[3px] origin-top -skew-x-[8deg] bg-brand lg:block" />
      </div>

      <div className="container-x relative flex min-h-[100svh] flex-col justify-end pt-28 pb-[calc(3.5vw+3.5rem)] lg:min-h-[44rem] lg:justify-center">
        <div className="max-w-2xl lg:max-w-[47%]">
          <p className="hero-in eyebrow" style={{ animationDelay: '0.05s' }}>
            Importador directo · {business.city}
          </p>
          <h1 id="hero-title" className="h-display mt-4 text-[2.6rem] min-[400px]:text-[2.9rem] sm:text-6xl lg:text-[4.4rem]">
            Cristales automotrices y <span className="text-brand">láminas de seguridad</span> para tu vehículo
          </h1>
          <p className="hero-in mt-4 font-display text-2xl font-bold tracking-wide text-snow uppercase sm:text-3xl" style={{ animationDelay: '0.14s' }}>
            Tu vehículo, <span className="text-brand">en las mejores manos.</span>
          </p>
          <p className="hero-in mt-4 max-w-xl text-lg text-snow/90 sm:text-xl" style={{ animationDelay: '0.2s' }}>
            Importamos, vendemos y colocamos cristales para todo tipo de vehículo.{' '}
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
