import { business } from '@/data/business';
import { services } from '@/data/services';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
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
          intro="Cristales automotrices, láminas de seguridad Security Film, venta mayorista para talleres y servicio a domicilio. Te lo resolvemos por WhatsApp."
        />

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <Reveal as="li" key={s.id} delay={(i % 4) * 0.08} className="h-full">
              <article className="card card-hover group flex h-full flex-col overflow-hidden">
                <div className="glass-sheen relative aspect-[16/11] overflow-hidden">
                  <Picture
                    name={s.image}
                    alt={s.imageAlt}
                    sizes="(min-width: 1024px) 290px, (min-width: 640px) 45vw, calc((100vw - 2rem) * 0.67)"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-carbon/80 to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="h-display text-3xl">{s.title}</h3>
                  <p className="mt-3 text-mist">{s.description}</p>
                  {s.bullets.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-[0.97rem]">
                          <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand" /> {b}
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.schedule && (
                    <div className="mt-4 rounded-xl border border-line bg-ink/60 p-3">
                      <p className="eyebrow text-xs">Días de recorrido</p>
                      <ul className="mt-2 space-y-1.5 text-[0.95rem]">
                        {business.homeServiceDays.map((d) => (
                          <li key={d.zone} className="flex items-start gap-2">
                            <IconCheck className="mt-1 h-4 w-4 shrink-0 text-brand" />
                            <span>
                              <strong className="font-semibold text-snow">{d.zone}:</strong> <span className="text-mist">{d.days.toLowerCase()}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="mt-auto flex flex-wrap-reverse gap-3 pt-6">
                    {s.whatsappMessage ? (
                      <a
                        href={buildWhatsAppUrl(s.whatsappMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm"
                        aria-label={`Consultar por ${s.title} por WhatsApp`}
                      >
                        <IconWhatsApp className="h-5 w-5" /> Consultar
                      </a>
                    ) : (
                      <QuoteButton preset={s.quote} className="btn btn-primary btn-sm" ariaLabel={s.cta ? `${s.cta}: ${s.title}` : `Consultar por ${s.title}`}>
                        <IconWhatsApp className="h-5 w-5" /> {s.cta ?? 'Consultar'}
                      </QuoteButton>
                    )}
                    {s.secondary && (
                      <a href={s.secondary.href} className="btn btn-ghost btn-sm">
                        {s.secondary.label}
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
          <Reveal as="li" delay={0.1} className="sm:col-span-2 lg:col-span-4">
            <div className="hex-pattern flex flex-col gap-5 rounded-2xl border border-line bg-carbon p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <p className="eyebrow">¿No sabés cuál es tu vidrio?</p>
                <p className="h-display mt-3 text-3xl">
                  Mandanos una foto de tu vehículo <span className="text-brand">y te asesoramos</span>
                </p>
                <p className="mt-3 text-mist">
                  Parabrisas, luneta, puerta delantera o trasera, derecha o izquierda: identificar el vidrio correcto nos ayuda a cotizarte más rápido.
                </p>
              </div>
              <div className="shrink-0">
                <QuoteButton preset={{ service: 'Otro', source: 'servicio' }} className="btn btn-outline btn-sm">
                  Consultanos por WhatsApp
                </QuoteButton>
              </div>
            </div>
          </Reveal>
        </ul>
      </div>
    </section>
  );
}
