'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'li' | 'section' | 'article';
  y?: number;
};

/**
 * Entrada al hacer scroll: fade + slide corto.
 * Con prefers-reduced-motion, <MotionConfig reducedMotion="user"> anula el desplazamiento
 * y solo queda un fundido breve.
 */
export function Reveal({ children, delay = 0, className, as = 'div', y = 22 }: Props) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  center,
  id,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  center?: boolean;
  id?: string;
}) {
  return (
    <Reveal className={`mb-10 max-w-3xl ${center ? 'mx-auto text-center' : ''}`}>
      <p className={`eyebrow ${center ? 'justify-center' : ''}`}>{eyebrow}</p>
      <h2 id={id} className="h-display mt-3 text-4xl sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {intro && <p className="mt-4 text-lg text-mist">{intro}</p>}
    </Reveal>
  );
}
