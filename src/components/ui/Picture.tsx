import manifest from '@/data/images.json';

type Entry = { width: number; height: number; sizes: number[] };
const images = manifest as Record<string, Entry>;

export function imageSrc(name: string, preferWidth = 960) {
  const e = images[name];
  if (!e) return `/img/${name}`;
  const w = e.sizes.find((s) => s >= preferWidth) ?? e.sizes[e.sizes.length - 1];
  return `/img/${name}-${w}.webp`;
}

export function imageSrcSet(name: string) {
  const e = images[name];
  if (!e) return undefined;
  return e.sizes.map((w) => `/img/${name}-${w}.webp ${w}w`).join(', ');
}

type Props = {
  name: string;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
  style?: React.CSSProperties;
};

/** Imagen responsive a partir de los WebP generados por scripts/process-images.mjs */
export function Picture({ name, alt, sizes = '100vw', className, priority, style }: Props) {
  const e = images[name];
  if (!e) {
    // Imagen todavía no generada (p. ej. render del simulador): placeholder accesible
    return (
      <div
        role="img"
        aria-label={alt}
        className={`bg-carbon-2 hex-pattern ${className ?? ''}`}
        style={style}
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageSrc(name)}
      srcSet={imageSrcSet(name)}
      sizes={sizes}
      width={e.width}
      height={e.height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      className={className}
      style={style}
    />
  );
}
