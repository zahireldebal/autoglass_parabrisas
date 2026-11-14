import { business } from '@/data/business';
import { Reveal } from '@/components/ui/Reveal';
import { IconShield, IconWhatsApp } from '@/components/ui/Icons';
import { QuoteButton } from '@/components/quote/QuoteContext';

export function Insurance() {
  if (!business.worksWithInsurance) return null;
  return (
    <section id="seguros" aria-labelledby="seguros-title" className="py-6 sm:py-10">
      <div className="container-x">
        <Reveal className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-carbon-2 to-ink">
          {/* Única cinta de precaución del sitio */}
          <div className="caution-tape" aria-hidden />
          <div className="grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-[auto_1fr_auto]">
            <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand text-ink">
              <IconShield className="h-10 w-10" />
            </span>
            <div>
              <p className="eyebrow">Seguros</p>
              <h2 id="seguros-title" className="h-display mt-2 text-4xl sm:text-5xl">
                ¿Tenés seguro? <span className="text-brand">Gestionamos el cambio</span>
              </h2>
              <p className="mt-3 max-w-2xl text-lg text-mist">
                Gestionamos el cambio de tu parabrisas o cristal, <strong className="text-snow">gratis según tu cobertura</strong>. Contanos con qué aseguradora
                estás y nos ocupamos.
              </p>
            </div>
            <QuoteButton preset={{ service: 'Cambio de parabrisas', source: 'servicio' }} className="btn btn-primary">
              <IconWhatsApp className="h-5 w-5" /> Consultá por tu seguro
            </QuoteButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
