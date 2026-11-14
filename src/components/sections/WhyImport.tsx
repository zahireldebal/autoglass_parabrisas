import { Picture } from '@/components/ui/Picture';
import { Reveal } from '@/components/ui/Reveal';
import { IconBoxes, IconCheck, IconShip, IconTag } from '@/components/ui/Icons';

const points = [
  {
    icon: IconTag,
    title: 'Mejor precio',
    text: 'Al importar directamente no hay intermediarios en el medio: eso se nota en lo que pagás. No pagués de más.',
  },
  {
    icon: IconBoxes,
    title: 'Disponibilidad',
    text: 'Tenemos stock de cristales para todas las marcas y modelos. Muchas veces lo tenemos en el momento.',
  },
  {
    icon: IconShip,
    title: 'Lo que no está, lo conseguimos',
    text: '¿Un modelo difícil? Como importamos, podemos buscar ese cristal que no encontrás en otro lado.',
  },
];

export function WhyImport() {
  return (
    <section id="importacion" aria-labelledby="importacion-title" className="cut-both relative overflow-hidden bg-carbon py-[calc(3.5vw+5rem)]">
      <div className="container-x grid items-center gap-10 lg:grid-cols-2">
        <Reveal className="relative order-2 lg:order-1">
          <div className="glass-sheen relative overflow-hidden rounded-2xl">
            <Picture
              name="taller-importacion"
              alt="Recepción del taller Autoglass con el cartel Importación, venta y colocación"
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div aria-hidden className="absolute -bottom-3 -left-3 h-24 w-24 border-b-4 border-l-4 border-brand" />
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <p className="eyebrow">Por qué elegirnos</p>
            <h2 id="importacion-title" className="h-display mt-3 text-4xl sm:text-5xl lg:text-6xl">
              Importador directo: <span className="text-brand">la diferencia está en el origen</span>
            </h2>
            <p className="mt-4 text-lg text-mist">
              Importamos, vendemos y colocamos cristales automotrices. Al no depender de terceros, te ofrecemos mejor precio, más disponibilidad y una colocación
              profesional en el mismo lugar.
            </p>
          </Reveal>
          <ul className="mt-8 grid gap-4">
            {points.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 0.08} className="flex gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-steel text-brand">
                  <p.icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="h-display text-2xl">{p.title}</h3>
                  <p className="mt-1 text-mist">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={0.25}>
            <p className="mt-8 flex items-center gap-2 font-semibold">
              <IconCheck className="h-5 w-5 text-brand" /> Con la compra del cristal, la colocación es GRATIS.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
