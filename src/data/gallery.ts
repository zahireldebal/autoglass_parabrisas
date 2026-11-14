/**
 * Galería de trabajos. Para sumar fotos: procesalas con `npm run images`
 * (agregándolas en scripts/process-images.mjs) y agregalas acá.
 * No repetir fotos que ya se usan en el hero, servicios o contacto.
 */
export const GALLERY_CATEGORIES = [
  { value: 'parabrisas', label: 'Parabrisas' },
  { value: 'laminas', label: 'Láminas y polarizado' },
  { value: 'taller', label: 'El taller' },
] as const;
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number]['value'];

export const gallery: { name: string; alt: string; caption: string; category: GalleryCategory }[] = [
  {
    name: 'saveiro-fachada',
    alt: 'Volkswagen Saveiro roja estacionada frente al taller Autoglass Parabrisas',
    caption: 'Trabajos del día en el taller de Maldonado',
    category: 'taller',
  },
  {
    name: 'filtracion-burlete',
    alt: 'Manos retirando el burlete de un parabrisas mal colocado que filtraba agua',
    caption: 'Parabrisas mal colocado: corrección de filtraciones',
    category: 'parabrisas',
  },
  {
    name: 'camaro-taller',
    alt: 'Chevrolet Camaro naranja dentro del taller de Autoglass',
    caption: 'Cristales para todas las marcas y modelos',
    category: 'parabrisas',
  },
  {
    name: 'fachada-acceso',
    alt: 'Acceso al taller Autoglass con flechas amarillas pintadas en el piso',
    caption: 'Nuestro taller en Manuel Ledesma esq. 18 de Julio',
    category: 'taller',
  },
  {
    name: 'carteles-taller',
    alt: 'Carteles de Autoglass Parabrisas: importador directo, láminas de seguridad y polarizados',
    caption: 'Importador directo · Láminas de seguridad · Polarizados',
    category: 'taller',
  },
];
