'use client';

import dynamic from 'next/dynamic';
import { useCallback, useMemo, useRef, useState } from 'react';
import { gallery, GALLERY_CATEGORIES, type GalleryCategory } from '@/data/gallery';
import { imageSrc, imageSrcSet } from '@/components/ui/Picture';
import { Reveal, SectionHeading } from '@/components/ui/Reveal';
import { IconInstagram } from '@/components/ui/Icons';
import { business } from '@/data/business';
import manifest from '@/data/images.json';

const dims = manifest as Record<string, { width: number; height: number }>;
const GalleryLightbox = dynamic(() => import('./GalleryLightbox'), { ssr: false });

export function Gallery() {
  const [filter, setFilter] = useState<GalleryCategory | 'todos'>('todos');
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  /** Foto con la que se abrió el lightbox: solo esa hace el zoom desde la miniatura. */
  const [origin, setOrigin] = useState<{ name: string; rect: DOMRect } | null>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const [lbLoaded, setLbLoaded] = useState(false);

  const categories = GALLERY_CATEGORIES.filter((c) => gallery.some((g) => g.category === c.value));
  const items = useMemo(() => (filter === 'todos' ? gallery : gallery.filter((g) => g.category === filter)), [filter]);

  const close = useCallback(() => {
    setOpenIdx((i) => {
      if (i !== null) setTimeout(() => triggers.current[i]?.focus(), 0);
      return null;
    });
  }, []);
  const go = useCallback((d: number) => setOpenIdx((i) => (i === null ? i : (i + d + items.length) % items.length)), [items.length]);

  return (
    <section id="trabajos" aria-labelledby="trabajos-title" className="py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading
          id="trabajos-title"
          eyebrow="Galería"
          title={
            <>
              Trabajos <span className="text-brand">reales</span> de nuestro taller
            </>
          }
          intro="Fotos de trabajos y del taller en Maldonado. Mirá más en nuestro Instagram."
        />

        <div role="group" aria-label="Filtrar trabajos" className="mb-8 flex flex-wrap gap-2">
          {[{ value: 'todos' as const, label: 'Todos' }, ...categories].map((c) => (
            <button key={c.value} type="button" className="chip" aria-pressed={filter === c.value} onClick={() => setFilter(c.value)}>
              {c.label}
            </button>
          ))}
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {items.map((g, i) => (
                <li key={`${filter}-${g.name}`} className={`fade-in ${i === 0 ? 'col-span-2 lg:col-span-2 lg:row-span-2' : ''}`}>
                  <button
                    ref={(el) => {
                      triggers.current[i] = el;
                    }}
                    type="button"
                    onClick={(e) => {
                      setOrigin({ name: g.name, rect: e.currentTarget.getBoundingClientRect() });
                      setLbLoaded(true);
                      setOpenIdx(i);
                    }}
                    className="group glass-sheen relative block h-full w-full overflow-hidden rounded-xl bg-carbon-2"
                    aria-label={`Ampliar foto: ${g.caption}`}
                  >
                    <img
                      src={imageSrc(g.name, 480)}
                      srcSet={imageSrcSet(g.name)}
                      sizes={i === 0 ? '(min-width: 1024px) 66vw, (min-width: 640px) 100vw, 67vw' : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 34vw'}
                      width={dims[g.name]?.width}
                      height={dims[g.name]?.height}
                      alt={g.alt}
                      loading="lazy"
                      decoding="async"
                      style={g.position ? { objectPosition: g.position } : undefined}
                      className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] ${i === 0 ? 'aspect-[4/3] lg:aspect-auto' : 'aspect-square'}`}
                    />
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-3 pt-10 text-left text-sm font-semibold sm:text-base">
                      {g.caption}
                    </span>
                  </button>
                </li>
              ))}
        </ul>

        {lbLoaded && (
          <GalleryLightbox
            origin={origin}
            item={openIdx !== null ? (items[openIdx] ?? null) : null}
            index={openIdx ?? 0}
            total={items.length}
            onClose={close}
            onPrev={() => go(-1)}
            onNext={() => go(1)}
          />
        )}

        <Reveal className="mt-10 text-center">
          <a href={business.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            <IconInstagram className="h-5 w-5" /> Más trabajos en {business.instagram.handle}
          </a>
        </Reveal>
      </div>
    </section>
  );
}

