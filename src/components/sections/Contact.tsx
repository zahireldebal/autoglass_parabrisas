'use client';

import { useEffect, useState } from 'react';
import { business, telHref, waBase } from '@/data/business';
import { Picture } from '@/components/ui/Picture';
import { Reveal, SectionHeading } from '@/components/ui/Reveal';
import { IconArrowRight, IconClock, IconInstagram, IconPhone, IconPin, IconWhatsApp } from '@/components/ui/Icons';
import { QuoteForm } from '@/components/quote/QuoteForm';

function useTodayIndex() {
  const [day, setDay] = useState<number | null>(null);
  useEffect(() => setDay(new Date().getDay()), []);
  return day;
}

export function Contact() {
  const today = useTodayIndex();
  const [mapOn, setMapOn] = useState(false);

  return (
    <section id="contacto" aria-labelledby="contacto-title" className="cut-top bg-carbon pt-[calc(3.5vw+5rem)] pb-20 sm:pb-28">
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
            <QuoteForm />
          </Reveal>

          {/* Datos + mapa */}
          <Reveal delay={0.08} className="grid content-start gap-6">
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <li>
                <a href={waBase} target="_blank" rel="noopener noreferrer" className="card flex min-h-20 items-center gap-4 p-4 transition-colors hover:border-brand">
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

            <div className="card p-5">
              <h3 className="flex items-center gap-2 font-display text-2xl font-bold uppercase">
                <IconClock className="h-6 w-6 text-brand" /> Horarios
              </h3>
              <table className="mt-3 w-full text-[0.98rem]">
                <caption className="sr-only">Horarios de atención</caption>
                <tbody>
                  {business.hours.map((h) => {
                    const isToday = today === h.day;
                    return (
                      <tr key={h.day} className={`border-b border-line/60 last:border-0 ${isToday ? 'text-brand' : ''}`}>
                        <th scope="row" className="py-2 text-left font-semibold">
                          {h.label}
                          {isToday && <span className="ml-2 rounded-full bg-brand px-2 py-0.5 text-xs font-bold text-ink">Hoy</span>}
                        </th>
                        <td className={`py-2 text-right ${isToday ? '' : 'text-mist'}`}>{h.open ? `${h.open} a ${h.close}` : 'Cerrado'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="card overflow-hidden">
              <div className="relative aspect-[16/10] bg-ink">
                {mapOn ? (
                  <iframe
                    title={`Mapa: ${business.name}, ${business.address.street}`}
                    src={business.mapEmbedUrl}
                    className="absolute inset-0 h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setMapOn(true)}
                    className="group absolute inset-0 h-full w-full"
                    aria-label="Mostrar el mapa interactivo de Google Maps"
                  >
                    <Picture
                      name="fachada-frente"
                      alt=""
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="h-full w-full object-cover opacity-70 transition-opacity group-hover:opacity-50"
                    />
                    <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink/30">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-ink shadow-lg">
                        <IconPin className="h-7 w-7" />
                      </span>
                      <span className="rounded-full bg-ink/85 px-4 py-2 font-display text-lg font-bold uppercase tracking-wide">Ver mapa</span>
                    </span>
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-3 p-4 sm:flex-row">
                <a href={business.directionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary flex-1">
                  Cómo llegar <IconArrowRight className="h-5 w-5" />
                </a>
                <a href={business.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost flex-1">
                  Abrir en Google Maps
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
