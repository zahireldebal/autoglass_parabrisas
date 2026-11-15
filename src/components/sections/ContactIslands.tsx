'use client';

import { useEffect, useState } from 'react';
import { business } from '@/data/business';
import { Picture } from '@/components/ui/Picture';
import { IconArrowRight, IconClock, IconPin } from '@/components/ui/Icons';

/** Tabla de horarios: resalta el día de hoy (se calcula en el navegador). */
export function HoursCard() {
  const [today, setToday] = useState<number | null>(null);
  useEffect(() => setToday(new Date().getDay()), []);
  return (
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

  );
}

/** Mapa: se carga el iframe de Google Maps recién al tocar (no pesa en la carga inicial). */
export function MapCard() {
  const [mapOn, setMapOn] = useState(false);
  return (
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
              sizes="(min-width: 1024px) 40vw, (min-width: 640px) 100vw, 67vw"
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
  );
}
