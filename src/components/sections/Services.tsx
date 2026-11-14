import { services } from '@/data/services';
import { FILM_TYPES } from '@/data/options';
import { Picture } from '@/components/ui/Picture';
import { Reveal, SectionHeading } from '@/components/ui/Reveal';
import { IconCheck, IconWhatsApp } from '@/components/ui/Icons';
import { QuoteButton } from '@/components/quote/QuoteContext';

export function Services() {
  return (
    <section id="servicios" aria-labelledby="servicios-title" className="py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading
          id="servicios-title"
          eyebrow="Servicios"
          title={
            <>
              Todo para los cristales <span className="text-brand">de tu vehículo</span>
            </>
          }
          intro="Cambio de parabrisas en Maldonado, lunetas, vidrios laterales, polarizado de autos y láminas de seguridad. Cotizamos según tu vehículo, por WhatsApp."
        />

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal as="li" key={s.id} delay={(i % 3) * 0.08} className="h-full">
              <article className="card group flex h-full flex-col overflow-hidden">
                <div className="glass-sheen relative aspect-[16/10] overflow-hidden">
                  <Picture
                    name={s.image}
                    alt={s.imageAlt}
                    sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, calc(100vw - 2rem)"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-carbon/80 to-transparent" />
                  {s.illustrative && (
                    <span className="absolute top-3 left-3 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-snow">
                      Imagen ilustrativa
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="h-display text-3xl">{s.title}</h3>
                  <p className="mt-3 text-mist">{s.description}</p>
                  <ul className="mt-4 space-y-2">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-[0.97rem]">
                        <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand" /> {b}
                      </li>
                    ))}
                  </ul>
                  {s.showFilms && (
                    <div className="mt-5">
                      <p className="text-sm font-semibold tracking-wide text-mist uppercase">Láminas disponibles</p>
                      <ul className="mt-2 flex flex-wrap gap-2">
                        {FILM_TYPES.map((f) => (
                          <li key={f.value} className="rounded-full border border-brand/60 px-3 py-1 text-sm font-semibold text-brand" title={f.description}>
                            {f.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="mt-auto flex flex-wrap gap-3 pt-6">
                    <QuoteButton preset={{ service: s.formService, source: 'servicio' }} className="btn btn-primary btn-sm" ariaLabel={`Consultar por ${s.title}`}>
                      <IconWhatsApp className="h-5 w-5" /> Consultar
                    </QuoteButton>
                    {s.id === 'polarizado' && (
                      <a href="#simulador" className="btn btn-ghost btn-sm">
                        Probá el simulador
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
          <Reveal as="li" delay={0.16} className="h-full">
            <div className="hex-pattern flex h-full flex-col justify-center rounded-2xl border border-line bg-carbon p-6 sm:p-8">
              <p className="eyebrow">¿No sabés cuál es tu vidrio?</p>
              <p className="h-display mt-3 text-3xl">
                Mandanos una foto de tu auto <span className="text-brand">y te asesoramos</span>
              </p>
              <p className="mt-3 text-mist">Parabrisas, luneta, puerta delantera o trasera, derecha o izquierda: identificar el vidrio correcto nos ayuda a cotizarte más rápido.</p>
              <div className="mt-6">
                <QuoteButton preset={{ service: 'Otro', source: 'servicio' }} className="btn btn-outline btn-sm">
                  Consultá por WhatsApp
                </QuoteButton>
              </div>
            </div>
          </Reveal>
        </ul>
      </div>
    </section>
  );
}
