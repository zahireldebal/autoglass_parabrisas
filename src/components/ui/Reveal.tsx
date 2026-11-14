import type { CSSProperties, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'li' | 'section' | 'article';
};

/**
 * Entrada al hacer scroll (fade + slide corto) hecha con CSS: la activa <RevealObserver/>.
 * Sin JavaScript o con prefers-reduced-motion, el contenido se ve sin animación.
 * Es un componente de servidor: no suma JavaScript a la página.
 */
export function Reveal({ children, delay = 0, className, as: Tag = 'div' }: Props) {
  return (
    <Tag data-reveal="" className={className} style={delay ? ({ '--reveal-delay': `${delay}s` } as CSSProperties) : undefined}>
      {children}
    </Tag>
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
