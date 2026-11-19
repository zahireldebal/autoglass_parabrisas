import { business } from '@/data/business';
import { Reveal, SectionHeading } from '@/components/ui/Reveal';
import { IconArrowRight, IconInstagram, IconStar } from '@/components/ui/Icons';

/**
 * SOLO reseñas reales. Estas son respuestas de clientes publicadas en una historia
 * de Instagram de @parabrisas_autoglass_ (destacada "Reseñas"), sin nombre.
 * Había una tercera, pero estaba tapada en la captura y no se pudo confirmar el texto completo: se quitó.
 */
const reviews = [
  { text: 'Vinieron a casa y me solucionaron el parabrisas al toque, los mejores.' },
  { text: 'Me lograron conseguir el parabrisas que no lograba encontrar por ningún lado, un 10.' },
];

export function Reviews() {
  const rating = business.google.rating.toString().replace('.', ',');
  return (
    <section id="opiniones" aria-labelledby="opiniones-title" className="pb-20 sm:pb-28">
      <div className="container-x">
        <SectionHeading
          id="opiniones-title"
          eyebrow="Opiniones"
          title={
            <>
              Lo que dicen <span className="text-brand">nuestros clientes</span>
            </>
          }
        />
        <div className="grid gap-6 lg:grid-cols-[0.9fr_2fr]">
          <Reveal className="card flex flex-col items-start justify-center gap-4 p-6 sm:p-8">
            <p className="font-display text-7xl leading-none font-extrabold text-brand">{rating}</p>
            <div className="flex text-brand" role="img" aria-label={`${rating} de 5 estrellas`}>
              {[0, 1, 2, 3, 4].map((i) => (
                <IconStar key={i} className={`h-7 w-7 ${i === 4 ? 'opacity-60' : ''}`} />
              ))}
            </div>
            <p className="text-lg">
              <strong>{business.google.reviewCount} reseñas</strong> en Google
            </p>
            <a href={business.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
              Ver reseñas en Google <IconArrowRight className="h-5 w-5" />
            </a>
          </Reveal>

          <ul className="grid gap-4 md:grid-cols-2">
            {reviews.map((r, i) => (
              <Reveal as="li" key={r.text} delay={i * 0.08} className="card relative flex flex-col p-6">
                <span aria-hidden className="font-display text-6xl leading-none text-brand/70">“</span>
                <blockquote className="-mt-4 flex-1 text-lg">
                  <p>{r.text}</p>
                </blockquote>
                <p className="mt-4 flex items-center gap-2 text-sm text-mist">
                  <IconInstagram className="h-4 w-4" /> Respuesta de cliente en Instagram
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
