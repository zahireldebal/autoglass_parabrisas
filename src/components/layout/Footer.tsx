import { business, telHref, waBase } from '@/data/business';
import { services } from '@/data/services';
import { IconInstagram, IconPhone, IconPin, IconWhatsApp } from '@/components/ui/Icons';

export function Footer() {
  return (
    <footer data-hide-fab className="relative border-t border-line bg-carbon pt-14 pb-28 sm:pb-14">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-brand" aria-hidden />
      <div className="container-x grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <a href="#inicio" className="inline-flex items-center gap-3" aria-label="Autoglass Parabrisas, volver al inicio">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/logo-160.webp" alt="" width={160} height={160} loading="lazy" className="h-16 w-16 rounded-full" />
            <span className="h-display text-2xl">
              Autoglass <span className="text-brand">Parabrisas</span>
            </span>
          </a>
          <p className="mt-4 max-w-xs text-mist">
            Importación, venta y colocación de cristales automotrices en {business.city}. {business.tagline}.
          </p>
        </div>

        <div>
          <h2 className="h-display text-xl text-brand">Servicios</h2>
          <ul className="mt-4 space-y-3 text-mist">
            {services.map((s) => (
              <li key={s.id}>
                {/* before: amplía la zona táctil a 44 px sin cambiar cómo se ve */}
                <a href="#servicios" className="nav-link block w-fit before:absolute before:inset-x-0 before:-inset-y-1.5 before:content-[''] hover:text-snow">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="h-display text-xl text-brand">Contacto</h2>
          <ul className="mt-4 space-y-3 text-mist">
            <li>
              <a href={waBase} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 hover:text-snow">
                <IconWhatsApp className="h-5 w-5 text-brand" /> WhatsApp {business.whatsappDisplay}
              </a>
            </li>
            <li>
              <a href={telHref} className="inline-flex min-h-11 items-center gap-2 hover:text-snow">
                <IconPhone className="h-5 w-5 text-brand" /> Teléfono {business.phoneDisplay}
              </a>
            </li>
            <li className="flex gap-2">
              <IconPin className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
              <span>
                {business.address.street}, {business.address.locality}
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="h-display text-xl text-brand">Horarios y redes</h2>
          <ul className="mt-4 space-y-1 text-mist">
            {business.hoursSummary.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          <a
            href={business.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-11 items-center gap-2 text-mist hover:text-snow"
          >
            <IconInstagram className="h-5 w-5 text-brand" /> {business.instagram.handle}
          </a>
        </div>
      </div>

      <div className="container-x mt-12 flex flex-col gap-2 border-t border-line pt-6 text-sm text-mist sm:flex-row sm:items-center sm:justify-between">
        <p>{business.credits}</p>
        <p>
          <a href={business.modelCredit.url} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:text-snow hover:underline">
            {business.modelCredit.text}
          </a>
        </p>
      </div>
    </footer>
  );
}
