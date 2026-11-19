'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { GlassScope, LocationValue, ServiceOption } from '@/data/options';

export type QuotePreset = {
  service?: ServiceOption;
  glassScope?: GlassScope;
  location?: LocationValue;
  /** De dónde vino (para el título del modal). */
  source?: 'simulador' | 'servicio' | 'general';
};

type Ctx = {
  open: boolean;
  preset: QuotePreset | null;
  /** Cambia en cada apertura para que el formulario aplique el preset aunque sea igual. */
  nonce: number;
  openQuote: (preset?: QuotePreset) => void;
  closeQuote: () => void;
};

const QuoteCtx = createContext<Ctx | null>(null);

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState<QuotePreset | null>(null);
  const [nonce, setNonce] = useState(0);

  const openQuote = useCallback((p?: QuotePreset) => {
    setPreset(p ?? null);
    setNonce((n) => n + 1);
    setOpen(true);
  }, []);
  const closeQuote = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ open, preset, nonce, openQuote, closeQuote }), [open, preset, nonce, openQuote, closeQuote]);
  return <QuoteCtx.Provider value={value}>{children}</QuoteCtx.Provider>;
}

export function useQuote() {
  const ctx = useContext(QuoteCtx);
  if (!ctx) throw new Error('useQuote debe usarse dentro de <QuoteProvider>');
  return ctx;
}

/** Botón que abre el formulario rápido con un servicio preseleccionado. */
export function QuoteButton({
  children,
  preset,
  className = 'btn btn-primary',
  ariaLabel,
}: {
  children: ReactNode;
  preset?: QuotePreset;
  className?: string;
  ariaLabel?: string;
}) {
  const { openQuote } = useQuote();
  return (
    <button type="button" className={className} onClick={() => openQuote(preset)} aria-label={ariaLabel} aria-haspopup="dialog">
      {children}
    </button>
  );
}
