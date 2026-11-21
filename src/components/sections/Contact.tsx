import { business, telHref } from '@/data/business';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { Reveal, SectionHeading } from '@/components/ui/Reveal';
import { IconInstagram, IconMail, IconPhone, IconPin, IconWhatsApp } from '@/components/ui/Icons';
import { HoursCard, MapCard } from './ContactIslands';
import { LazyQuoteForm } from '@/components/quote/LazyQuoteForm';

export function Contact() {
  return (
    <section id="contacto" data-hide-fab aria-labelledby="contacto-title" className="cut-top bg-carbon pt-[calc(3.5vw+5rem)] pb-20 sm:pb-28">
      <div className="container-x">
        <SectionHeading
          id="contacto-title"
          eyebrow="Contacto y ubicación"
          title={
            <>
              Cotizá por WhatsApp <span className="text-brand">o vení al taller</span>
            </>
          }
          intro={`Estamos en ${business.address.street}, ${business.address.locality}. Sin turno: llegás y lo resolvemos.`}
        />

        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          {/* Formulario */}
          <Reveal className="card p-5 sm:p-8">
            <h3 className="h-display text-3xl">Pedí tu cotización</h3>
            <p className="mt-1 mb-6 text-mist">Completá los datos y te armamos el mensaje para WhatsApp.</p>
            <LazyQuoteForm />
          </Reveal>

          {/* Datos + mapa */}
          <Reveal delay={0.08} className="grid content-start gap-6">
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <li>
                <a href={buildWhatsAppUrl('Hola, quiero hacer una consulta.')} target="_blank" rel="noopener noreferrer" className="card flex min-h-20 items-center gap-4 p-4 transition-colors hover:border-brand">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand text-ink">
                    <IconWhatsApp className="h-6 w-6" />
                  </span>
                  <span>
                    <span className="block text-sm text-mist">WhatsApp</span>
                    <span className="h-display text-2xl">{business.whatsappDisplay}</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={telHref} className="card flex min-h-20 items-center gap-4 p-4 transition-colors hover:border-brand">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-steel text-brand">
                    <IconPhone className="h-6 w-6" />
                  </span>
                  <span>
                    <span className="block text-sm text-mist">Teléfono fijo</span>
                    <span className="h-display text-2xl">{business.phoneDisplay}</span>
                  </span>
                </a>
              </li>
              <li className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
                <a href={`mailto:${business.email}`} className="card flex min-h-20 items-center gap-4 p-4 transition-colors hover:border-brand">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-steel text-brand">
                    <IconMail className="h-6 w-6" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm text-mist">Email</span>
                    <span className="block truncate font-semibold">{business.email}</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={business.instagram.url} target="_blank" rel="noopener noreferrer" className="card flex min-h-20 items-center gap-4 p-4 transition-colors hover:border-brand">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-steel text-brand">
                    <IconInstagram className="h-6 w-6" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm text-mist">Instagram</span>
                    <span className="block truncate font-semibold">{business.instagram.handle}</span>
                  </span>
                </a>
              </li>
              <li className="card flex min-h-20 items-center gap-4 p-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-steel text-brand">
                  <IconPin className="h-6 w-6" />
                </span>
                <span>
                  <span className="block text-sm text-mist">Dirección</span>
                  <span className="font-semibold">
                    {business.address.street}, {business.address.locality}
                  </span>
                </span>
              </li>
            </ul>

            <HoursCard />
            <MapCard />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
