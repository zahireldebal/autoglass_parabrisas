'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { useQuote } from './QuoteContext';
import { QuoteForm } from './QuoteForm';
import { IconX } from '@/components/ui/Icons';

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select,textarea,[tabindex]:not([tabindex="-1"])';

export default function QuoteModalContent() {
  const { open, closeQuote, preset, nonce } = useQuote();
  const panel = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    const scrollbar = window.innerWidth - html.clientWidth;
    html.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeQuote();
      } else if (e.key === 'Tab' && panel.current) {
        const items = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    if (!window.matchMedia('(pointer: fine)').matches) setTimeout(() => panel.current?.focus(), 50);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      html.style.overflow = prevOverflow;
      document.body.style.paddingRight = '';
      lastFocus.current?.focus?.();
    };
  }, [open, closeQuote]);

  const title =
    preset?.source === 'simulador'
      ? preset.service === 'Láminas de seguridad'
        ? 'Quiero mi lámina de seguridad'
        : 'Quiero cambiar mi parabrisas'
      : preset?.service
        ? `Consultá por ${preset.service.toLowerCase()}`
        : 'Cotizá por WhatsApp';

  return (
    <MotionConfig reducedMotion="user">
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={closeQuote} aria-hidden />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-title"
            tabIndex={-1}
            className="relative flex max-h-[94svh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl border border-line bg-carbon shadow-2xl outline-none sm:rounded-3xl"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="h-1 w-full bg-brand" aria-hidden />
            <div className="flex items-start justify-between gap-4 border-b border-line px-5 pt-4 pb-3 sm:px-7">
              <div>
                <p className="eyebrow text-sm">Respuesta por WhatsApp</p>
                <h2 id="quote-title" className="h-display mt-1 text-3xl sm:text-4xl">
                  {title}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeQuote}
                className="-mr-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-steel"
                aria-label="Cerrar formulario"
              >
                <IconX />
              </button>
            </div>
            <div className="overflow-y-auto overscroll-contain px-5 py-5 sm:px-7">
              <QuoteForm preset={preset} nonce={nonce} autoFocus />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </MotionConfig>
  );
}
