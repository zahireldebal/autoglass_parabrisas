'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const QuoteForm = dynamic(() => import('./QuoteForm').then((m) => m.QuoteForm), {
  ssr: false,
  loading: () => <FormSkeleton />,
});

function FormSkeleton() {
  return (
    <div aria-hidden className="grid animate-pulse gap-5">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i}>
          <div className="mb-2 h-4 w-32 rounded bg-steel" />
          <div className="h-12 rounded-lg bg-ink" />
        </div>
      ))}
      <div className="h-12 rounded-lg bg-brand/40" />
    </div>
  );
}

/** Formulario de la sección Contacto: se descarga cuando la sección se acerca a la pantalla. */
export function LazyQuoteForm() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (e) => {
        if (e.some((x) => x.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: '700px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref}>{show ? <QuoteForm /> : <FormSkeleton />}</div>;
}
