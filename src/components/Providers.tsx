'use client';

import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';
import { QuoteProvider } from '@/components/quote/QuoteContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <QuoteProvider>{children}</QuoteProvider>
    </MotionConfig>
  );
}
