'use client';

import { useEffect, useState } from 'react';
import { IconWhatsApp } from '@/components/ui/Icons';
import { useQuote } from '@/components/quote/QuoteContext';

/** Botón flotante: abre el formulario rápido (no WhatsApp directo). */
export function FloatingWhatsApp() {
  const { openQuote, open } = useQuote();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (open) return null;

  return (
    <button
      type="button"
      onClick={() => openQuote()}
      aria-haspopup="dialog"
      aria-label="Consultar por WhatsApp"
      className={`fixed right-4 bottom-4 z-40 inline-flex h-16 items-center gap-2 rounded-full bg-[#11803f] pr-5 pl-4 font-display text-lg font-bold uppercase tracking-wide text-white shadow-[0_10px_30px_-6px_rgba(0,0,0,0.7)] ring-2 ring-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0d6a33] active:scale-[0.97] sm:right-6 sm:bottom-6 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <IconWhatsApp className="h-8 w-8" />
      <span className="hidden sm:inline">Consultá</span>
    </button>
  );
}
