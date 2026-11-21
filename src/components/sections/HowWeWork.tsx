import { business, homeServiceAlso, homeServiceFreeZones } from '@/data/business';
import { Reveal, SectionHeading } from '@/components/ui/Reveal';
import { IconChat, IconHome, IconTag, IconWrench } from '@/components/ui/Icons';

const steps = [
  { icon: IconChat, title: 'Consultás por WhatsApp', text: 'Contanos qué vidrio necesitás. Si tenés dudas, mandanos una foto de tu vehículo.' },
  { icon: IconTag, title: 'Te cotizamos según tu vehículo', text: 'Marca, modelo y año: te pasamos el precio del cristal exacto. Hasta 6 pagos.' },
  {
    icon: IconHome,
    title: 'Venís al taller o vamos a tu casa',
    text: `En el taller, sin turno. A domicilio, con agenda previa: sin costo en ${homeServiceFreeZones}. ${homeServiceAlso}`,
  },
  { icon: IconWrench, title: 'Colocación y entrega', text: `Colocación profesional ${business.replacementTime} y con garantía. Llegás, lo cambiamos y seguís camino.` },
];

export function HowWeWork() {
  return (
    <section id="como-trabajamos" aria-labelledby="como-title" className="py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading
          id="como-title"
          eyebrow="Cómo trabajamos"
          title={
            <>
              Simple, rápido <span className="text-brand">y sin turno</span>
            </>
          }
        />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.08} className="card relative overflow-hidden p-6">
              <span aria-hidden className="absolute -top-3 -right-1 font-display text-[6.5rem] leading-none font-extrabold text-white/[0.04]">
                {i + 1}
              </span>
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-brand text-brand">
                  <s.icon className="h-6 w-6" />
                </span>
                <span className="font-display text-lg font-bold text-mist">Paso {i + 1}</span>
              </div>
              <h3 className="h-display mt-4 text-2xl">{s.title}</h3>
              <p className="mt-2 text-mist">{s.text}</p>
              {i < steps.length - 1 && <span aria-hidden className="stripe absolute bottom-0 left-6 !w-10" />}
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
