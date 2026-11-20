'use client';

import { useId, useState } from 'react';
import { faq } from '@/data/faq';
import { Reveal, SectionHeading } from '@/components/ui/Reveal';
import { IconChevronDown } from '@/components/ui/Icons';
import { QuoteButton } from '@/components/quote/QuoteContext';

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const uid = useId();
  return (
    <section id="preguntas" aria-labelledby="faq-title" className="py-20 sm:py-28">
      <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <SectionHeading
            id="faq-title"
            eyebrow="Preguntas frecuentes"
            title={
              <>
                Lo que más <span className="text-brand">nos preguntan</span>
              </>
            }
            intro="¿No encontrás tu respuesta? Escribinos y te contestamos por WhatsApp."
          />
          <Reveal>
            <QuoteButton className="btn btn-outline">Hacé tu consulta</QuoteButton>
          </Reveal>
        </div>
        <Reveal>
          <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-carbon">
            {faq.map((f, i) => {
              const isOpen = open === i;
              const btnId = `${uid}-q${i}`;
              const panelId = `${uid}-a${i}`;
              return (
                <li key={f.q}>
                  <h3>
                    <button
                      id={btnId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex min-h-16 w-full items-center justify-between gap-4 px-5 py-4 text-left text-lg font-semibold transition-colors hover:text-brand sm:px-6"
                    >
                      {f.q}
                      <IconChevronDown className={`h-6 w-6 shrink-0 text-brand transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </h3>
                  <div id={panelId} role="region" aria-labelledby={btnId} className="expand-panel" data-open={isOpen} inert={!isOpen}>
                    <div>
                      <div className="px-5 pb-5 text-mist sm:px-6">
                        <p>{f.a}</p>
                        {f.list && (
                          <ul className="mt-2 list-disc space-y-1 pl-5 marker:text-brand">
                            {f.list.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
