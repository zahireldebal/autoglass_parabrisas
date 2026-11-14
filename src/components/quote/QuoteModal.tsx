'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useQuote } from './QuoteContext';

/** El formulario (react-hook-form, zod, animaciones) se descarga recién al abrir el modal por primera vez. */
const QuoteModalContent = dynamic(() => import('./QuoteModalContent'), { ssr: false });

export function QuoteModal() {
  const { open } = useQuote();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);
  // Precarga en momentos ociosos para que abra al instante
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const t = setTimeout(() => {
      if (w.requestIdleCallback) w.requestIdleCallback(() => import('./QuoteModalContent'), { timeout: 4000 });
    }, 6000);
    return () => clearTimeout(t);
  }, []);
  return mounted ? <QuoteModalContent /> : null;
}
