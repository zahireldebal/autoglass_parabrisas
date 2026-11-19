/**
 * Galería de trabajos. Para sumar fotos: procesalas con `npm run images`
 * (agregándolas en scripts/images.config.mjs) y agregalas acá.
 * No repetir fotos que ya se usan en el hero, servicios o contacto.
 * Con 13 fotos la grilla de escritorio (4 columnas, la primera ocupa 2×2) queda completa.
 */
export const GALLERY_CATEGORIES = [
  { value: 'parabrisas', label: 'Parabrisas y cristales' },
  { value: 'laminas', label: 'Láminas de seguridad' },
  { value: 'taller', label: 'El taller' },
] as const;
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number]['value'];

export const gallery: { name: string; alt: string; caption: string; category: GalleryCategory }[] = [
  {
    name: 'taller-stock',
    alt: 'Pasillo del taller Autoglass con estanterías altas llenas de parabrisas, escalera de madera y banco de herramientas',
    caption: 'Stock de cristales para todo tipo de vehículo',
    category: 'taller',
  },
  {
    name: 'cambio-parabrisas-taller',
    alt: 'Técnico de Autoglass con guantes ajustando el parabrisas de un vehículo rojo en el taller',
    caption: 'Colocación profesional de parabrisas',
    category: 'parabrisas',
  },
  {
    name: 'lamina-seguridad',
    alt: 'Técnico aplicando lámina de seguridad sobre una luneta con pistola de calor',
    caption: 'Colocación de lámina de seguridad',
    category: 'laminas',
  },
  {
    name: 'sellado-parabrisas',
    alt: 'Técnico de Autoglass aplicando sellador en el marco del parabrisas de un vehículo blanco, con el cartel del taller de fondo',
    caption: 'Un cristal roto o agrietado es peligroso: lo cambiamos en el día',
    category: 'parabrisas',
  },
  {
    name: 'taller-recepcion',
    alt: 'Sala de espera del taller con sillas, dispensador de agua y la pared amarilla con el logo de Autoglass',
    caption: 'Nuestro taller en Maldonado',
    category: 'taller',
  },
  {
    name: 'luneta-rota',
    alt: 'Vidrio lateral trasero roto de un vehículo gris, con restos de cristal en el marco',
    caption: 'Laterales, lunetas y aletas',
    category: 'parabrisas',
  },
  {
    name: 'parabrisas-colocado',
    alt: 'Parabrisas nuevo recién colocado en un vehículo gris, visto de cerca',
    caption: 'Parabrisas nuevo, listo para seguir camino',
    category: 'parabrisas',
  },
  {
    name: 'taller-oficina',
    alt: 'Oficina del taller Autoglass con carteles de las marcas Pilkington y Saint-Gobain Sekurit',
    caption: 'Atención en el taller',
    category: 'taller',
  },
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
    name: 'luneta-nivus',
    alt: 'Volkswagen Nivus blanco visto desde atrás, con su luneta, dentro del taller',
    caption: 'Lunetas para todas las marcas',
    category: 'parabrisas',
  },
  {
    name: 'fachada-acceso',
    alt: 'Acceso al taller Autoglass con flechas amarillas pintadas en el piso',
    caption: 'Nuestro taller en Manuel Ledesma esq. 18 de Julio',
    category: 'taller',
  },
];
