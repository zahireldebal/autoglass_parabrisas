'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { gallery, GALLERY_CATEGORIES, type GalleryCategory } from '@/data/gallery';
import { imageSrc, imageSrcSet } from '@/components/ui/Picture';
import { Reveal, SectionHeading } from '@/components/ui/Reveal';
import { IconChevronLeft, IconChevronRight, IconInstagram, IconX } from '@/components/ui/Icons';
import { business } from '@/data/business';
import manifest from '@/data/images.json';

const dims = manifest as Record<string, { width: number; height: number }>;

export function Gallery() {
  const [filter, setFilter] = useState<GalleryCategory | 'todos'>('todos');
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  /** Foto con la que se abrió el lightbox: solo esa hace el zoom desde la miniatura. */
  const [origin, setOrigin] = useState<{ name: string; rect: DOMRect } | null>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);

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

                  <motion.ul layout className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {items.map((g, i) => (
                <motion.li
                  key={g.name}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className={i === 0 ? 'col-span-2 lg:col-span-2 lg:row-span-2' : ''}
                >
                  <button
                    ref={(el) => {
                      triggers.current[i] = el;
                    }}
                    type="button"
                    onClick={(e) => {
                      setOrigin({ name: g.name, rect: e.currentTarget.getBoundingClientRect() });
                      setOpenIdx(i);
                    }}
                    className="group glass-sheen relative block h-full w-full overflow-hidden rounded-xl bg-carbon-2"
                    aria-label={`Ampliar foto: ${g.caption}`}
                  >
                    <img
                      src={imageSrc(g.name, 480)}
                      srcSet={imageSrcSet(g.name)}
                      sizes={i === 0 ? '(min-width: 1024px) 66vw, 100vw' : '(min-width: 1024px) 33vw, 50vw'}
                      width={dims[g.name]?.width}
                      height={dims[g.name]?.height}
                      alt={g.alt}
                      loading="lazy"
                      decoding="async"
                      className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] ${i === 0 ? 'aspect-[4/3] lg:aspect-auto' : 'aspect-square'}`}
                    />
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-3 pt-10 text-left text-sm font-semibold sm:text-base">
                      {g.caption}
                    </span>
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>

          <AnimatePresence>
            {openIdx !== null && items[openIdx] && (
              <Lightbox key="lb" origin={origin} item={items[openIdx]} index={openIdx} total={items.length} onClose={close} onPrev={() => go(-1)} onNext={() => go(1)} />
            )}
          </AnimatePresence>

        <Reveal className="mt-10 text-center">
          <a href={business.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            <IconInstagram className="h-5 w-5" /> Más trabajos en {business.instagram.handle}
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function Lightbox({
  origin,
  item,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  origin: { name: string; rect: DOMRect } | null;
  item: (typeof gallery)[number];
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const closeBtn = useRef<HTMLButtonElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const justDragged = useRef(false);
  const downOnBackdrop = useRef(false);
  const isBackdrop = (t: EventTarget) => t instanceof HTMLElement && t.dataset.backdrop === 'true';

  // Zoom desde la miniatura (FLIP) solo al abrir
  useLayoutEffect(() => {
    const el = imgRef.current;
    if (!el || !origin || origin.name !== item.name) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const s = Math.max(origin.rect.width / r.width, origin.rect.height / r.height);
    const dx = origin.rect.x + origin.rect.width / 2 - (r.x + r.width / 2);
    const dy = origin.rect.y + origin.rect.height / 2 - (r.y + r.height / 2);
    el.animate([{ transform: `translate(${dx}px, ${dy}px) scale(${s})`, opacity: 0.6 }, { transform: 'none', opacity: 1 }], {
      duration: 380,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onPrev();
      else if (e.key === 'ArrowRight') onNext();
      else if (e.key === 'Tab') {
        // foco atrapado dentro del lightbox
        const els = Array.from(document.querySelectorAll<HTMLElement>('[data-lightbox] button'));
        const i = els.indexOf(document.activeElement as HTMLElement);
        e.preventDefault();
        els[(i + (e.shiftKey ? -1 : 1) + els.length) % els.length]?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      html.style.overflow = prev;
    };
  }, [onClose, onPrev, onNext]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    justDragged.current = true;
    setTimeout(() => (justDragged.current = false), 250);
    if (info.offset.x < -60 || info.velocity.x < -400) onNext();
    else if (info.offset.x > 60 || info.velocity.x > 400) onPrev();
  };

  return (
    <motion.div
      data-lightbox
      role="dialog"
      aria-modal="true"
      aria-label={`Foto ${index + 1} de ${total}: ${item.caption}`}
      className="fixed inset-0 z-50 flex flex-col bg-black/95"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-backdrop="true"
      onPointerDown={(e) => {
        downOnBackdrop.current = isBackdrop(e.target);
      }}
      onClick={(e) => {
        // Cierra solo con un toque real sobre el fondo (no al terminar un swipe)
        if (!justDragged.current && downOnBackdrop.current && isBackdrop(e.target)) onClose();
      }}
    >
      <div data-backdrop="true" className="flex items-center justify-between p-3 sm:p-5">
        <p className="font-display text-lg font-semibold tracking-wide text-mist" aria-live="polite">
          {index + 1} / {total}
        </p>
        <button ref={closeBtn} type="button" onClick={onClose} className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-steel/80 hover:bg-steel" aria-label="Cerrar foto">
          <IconX />
        </button>
      </div>
      <div data-backdrop="true" className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-20">
        {/* Presencia propia: aísla el cambio de foto del cierre del lightbox */}
        <AnimatePresence initial={false} mode="popLayout">
        <motion.img
          ref={imgRef}
          key={item.name}
          width={dims[item.name]?.width}
          height={dims[item.name]?.height}
          initial={origin?.name === item.name ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          src={imageSrc(item.name, 1440)}
          srcSet={imageSrcSet(item.name)}
          sizes="100vw"
          alt={item.alt}
          drag={total > 1 ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.6}
          onDragEnd={onDragEnd}
          onClick={(e) => e.stopPropagation()}
          className="h-auto max-h-full w-auto max-w-full touch-pan-y rounded-lg object-contain select-none"
          draggable={false}
        />
        </AnimatePresence>
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-2 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ink/80 hover:bg-brand hover:text-ink sm:left-5"
              aria-label="Foto anterior"
            >
              <IconChevronLeft />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-2 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ink/80 hover:bg-brand hover:text-ink sm:right-5"
              aria-label="Foto siguiente"
            >
              <IconChevronRight />
            </button>
          </>
        )}
      </div>
      <p className="p-4 pb-6 text-center text-snow sm:text-lg" onClick={(e) => e.stopPropagation()}>
        {item.caption}
        <span className="mt-1 block text-sm text-mist">Deslizá o usá las flechas para ver más</span>
      </p>
    </motion.div>
  );
}
