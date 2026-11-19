import { business } from '@/data/business';
import { Reveal } from '@/components/ui/Reveal';
import { IconBoxes, IconCard, IconGift, IconHome, IconShip, IconTruck } from '@/components/ui/Icons';

const items = [
  { icon: IconShip, title: 'Importador directo', text: 'Sin intermediarios: mejor precio y disponibilidad.' },
  { icon: IconGift, title: 'Colocación sin costo', text: 'Con la compra del cristal.' },
  { icon: IconHome, title: 'A domicilio sin costo', text: business.homeServiceZones.join(' · ') },
  { icon: IconCard, title: 'Hasta 6 pagos', text: 'Con todas las tarjetas.' },
  { icon: IconTruck, title: 'Todo tipo de vehículo', text: 'Autos, camionetas, camiones, ómnibus y ambulancias.' },
  { icon: IconBoxes, title: 'Stock para todas las marcas', text: 'Y si no está, lo conseguimos.' },
];

export function TrustBar() {
  return (
    <section aria-label="Por qué Autoglass" className="relative -mt-[3.5vw] pt-[3.5vw]">
      <div className="container-x">
        <h2 className="sr-only">Por qué elegir Autoglass</h2>
        <ul className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <Reveal as="li" key={it.title} delay={i * 0.05} className="card flex gap-4 p-4 sm:p-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand text-ink">
                <it.icon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="h-display text-xl leading-tight">{it.title}</h3>
                <p className="mt-1 text-[0.95rem] text-mist">{it.text}</p>
              </div>
            </Reveal>
          ))}
          <Reveal as="li" delay={0.35} className="flex items-center rounded-2xl border border-dashed min-[420px]:col-span-2 border-brand/50 p-4 sm:p-5">
            <p className="font-display text-xl font-bold uppercase leading-tight tracking-wide">
              Llegás, lo cambiamos <span className="text-brand">y seguís camino.</span>
            </p>
          </Reveal>
        </ul>
      </div>
    </section>
  );
}
