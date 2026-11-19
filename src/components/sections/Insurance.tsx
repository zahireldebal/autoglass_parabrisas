import { business } from '@/data/business';
import { Picture } from '@/components/ui/Picture';
import { Reveal } from '@/components/ui/Reveal';
import { IconShield, IconWhatsApp } from '@/components/ui/Icons';
import { QuoteButton } from '@/components/quote/QuoteContext';

export function Insurance() {
  if (!business.worksWithInsurance) return null;
  return (
    <section id="seguros" aria-labelledby="seguros-title" className="py-16 sm:py-24">
      <div className="container-x">
        <Reveal className="relative overflow-hidden rounded-3xl border-2 border-brand/70 bg-gradient-to-br from-carbon-2 to-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]">
          {/* Única cinta de precaución del sitio */}
          <div className="caution-tape" aria-hidden />
          <div className="grid lg:grid-cols-[1.25fr_1fr]">
            <div className="p-6 sm:p-10 lg:p-12">
              <div className="flex items-center gap-4">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand text-ink sm:h-20 sm:w-20">
                  <IconShield className="h-9 w-9 sm:h-10 sm:w-10" />
                </span>
                <p className="eyebrow">Seguros</p>
              </div>
              <h2 id="seguros-title" className="h-display mt-5 text-[2.6rem] sm:text-6xl lg:text-7xl">
                Tu parabrisas <span className="text-brand">gratis</span> con el seguro de tu vehículo
              </h2>
              <p className="mt-5 max-w-2xl text-lg text-snow/90 sm:text-xl">
                Si tu vehículo tiene seguro, posiblemente tengas <strong className="text-snow">un cambio de cristal gratis al año</strong>. Nosotros nos
                encargamos de toda la gestión con tu aseguradora.
              </p>

              <h3 className="mt-8 font-display text-lg font-bold tracking-wide text-mist uppercase">Trabajamos con</h3>
              <ul className="mt-3 flex flex-wrap gap-2" aria-label="Aseguradoras con las que trabajamos">
                {business.insurers.map((name) => (
                  <li key={name} className="rounded-full border border-brand/60 bg-ink/70 px-4 py-2 font-semibold text-snow">
                    {name}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6" data-hide-fab>
                <QuoteButton preset={{ service: 'Cambio de parabrisas', source: 'servicio' }} className="btn btn-primary text-xl" ariaLabel="Consultanos por tu seguro">
                  <IconWhatsApp className="h-6 w-6" /> Consultanos por tu seguro
                </QuoteButton>
                <p className="text-sm text-mist">Sujeto a la cobertura de tu póliza.</p>
              </div>
            </div>

            <div className="relative min-h-72 lg:min-h-full">
              <Picture
                name="seguro-parabrisas"
                alt="Vehículo gris sin parabrisas frente a la pared amarilla con el cartel de Autoglass Parabrisas, listo para el cambio"
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="absolute inset-0 h-full w-full object-cover object-[50%_40%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent lg:bg-gradient-to-r lg:from-ink/80 lg:via-transparent" aria-hidden />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
