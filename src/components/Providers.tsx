'use client';

import type { ReactNode } from 'react';
import { QuoteProvider } from '@/components/quote/QuoteContext';
import { RevealObserver } from '@/components/ui/RevealObserver';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QuoteProvider>
      <RevealObserver />
      {children}
    </QuoteProvider>
  );
}
