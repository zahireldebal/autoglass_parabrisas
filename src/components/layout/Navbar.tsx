'use client';

import { useEffect, useRef, useState } from 'react';
import { IconMenu, IconWhatsApp, IconX } from '@/components/ui/Icons';
import { useQuote } from '@/components/quote/QuoteContext';

export const NAV_LINKS = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#security-film', label: 'Security Film' },
  { href: '#simulador', label: 'Simulador' },
  { href: '#trabajos', label: 'Trabajos' },
  { href: '#preguntas', label: 'Preguntas' },
  { href: '#contacto', label: 'Contacto' },
];

export function Navbar() {
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { openQuote } = useQuote();
  const menuBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuBtn.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        compact || menuOpen ? 'bg-ink/92 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.8)] backdrop-blur-md' : 'bg-gradient-to-b from-ink/80 to-transparent'
      }`}
    >
      <a href="#contenido" className="sr-only-focusable btn btn-primary btn-sm absolute left-4 top-2 z-50">
        Saltar al contenido
      </a>
      <nav aria-label="Principal" className={`container-x flex items-center justify-between transition-all duration-300 ${compact ? 'h-16' : 'h-20'}`}>
        <a href="#inicio" className="flex min-h-11 items-center gap-3" aria-label="Autoglass Parabrisas, ir al inicio">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/logo-160.webp"
            alt=""
            width={160}
            height={160}
            className={`rounded-full transition-all duration-300 ${compact ? 'h-10 w-10' : 'h-12 w-12'}`}
          />
          <span className="h-display text-xl leading-none whitespace-nowrap sm:text-2xl">
            Autoglass <span className="text-brand">Parabrisas</span>
          </span>
        </a>

        <ul className="hidden items-center gap-6 xl:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="nav-link font-display text-lg font-semibold uppercase tracking-wide">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button type="button" className="btn btn-primary btn-sm hidden sm:inline-flex" onClick={() => openQuote()} aria-haspopup="dialog">
            <IconWhatsApp className="h-5 w-5" /> Cotizá
          </button>
          <button
            ref={menuBtn}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-line xl:hidden"
            aria-expanded={menuOpen}
            aria-controls="menu-movil"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <IconX /> : <IconMenu />}
          </button>
        </div>
      </nav>

      <div id="menu-movil" className="expand-panel border-line bg-ink data-[open=true]:border-t xl:hidden" data-open={menuOpen} inert={!menuOpen}>
        <div>
            <ul className="container-x flex flex-col py-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-12 items-center border-b border-line/60 font-display text-xl font-semibold uppercase tracking-wide"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li className="pt-4 pb-2">
                <button
                  type="button"
                  className="btn btn-primary w-full"
                  onClick={() => {
                    setMenuOpen(false);
                    openQuote();
                  }}
                >
                  <IconWhatsApp className="h-5 w-5" /> Cotizá por WhatsApp
                </button>
              </li>
            </ul>
        </div>
      </div>
    </header>
  );
}
