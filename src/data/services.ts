import type { QuotePreset } from '@/components/quote/QuoteContext';

export type Service = {
  id: string;
  title: string;
  description: string;
  bullets: string[];
  image: string; // nombre base en /public/img (sin tamaño ni extensión)
  imageAlt: string;
  /** Formulario precargado al tocar "Consultar" (termina en WhatsApp). */
  quote?: QuotePreset;
  /** Si no usa el formulario: mensaje directo a WhatsApp (p. ej. talleres, que no tienen un vehículo puntual). */
  whatsappMessage?: string;
  /** Link secundario (otra sección de la página). */
  secondary?: { href: string; label: string };
};

export const services: Service[] = [
  {
    id: 'cristales-automotrices',
    title: 'Cristales automotrices',
    description: 'Parabrisas, lunetas, vidrios de puerta, laterales y aletas. Cambio y colocación profesional en el día.',
    bullets: ['Colocación sin costo con la compra del cristal', 'Para autos, camionetas y camiones'],
    image: 'cristales-saveiro',
    imageAlt: 'Técnico de Autoglass colocando el parabrisas de una Volkswagen Saveiro gris en el taller',
    quote: { service: 'Cambio de parabrisas', source: 'servicio' },
  },
  {
    id: 'laminas-seguridad',
    title: 'Láminas de seguridad Security Film',
    description:
      'Privacidad, protección y seguridad. Mucho más que un polarizado: mantiene el vidrio unido ante un impacto y dificulta el ingreso al vehículo.',
    bullets: ['Tono 20 %', 'Probala en el simulador 3D'],
    image: 'lamina-suv',
    imageAlt: 'Camioneta blanca en el taller con lámina de seguridad oscura en los vidrios laterales',
    quote: { service: 'Láminas de seguridad', source: 'servicio' },
    secondary: { href: '#security-film', label: 'Conocé la lámina' },
  },
  {
    id: 'venta-mayorista',
    title: 'Venta mayorista',
    description: '¿Tenés un taller? Te vendemos cristales y láminas por mayor para que los coloques vos.',
    bullets: ['Importador directo de cristales', 'Láminas de seguridad Security Film'],
    image: 'stock-cristales',
    imageAlt: 'Estantería del depósito con decenas de parabrisas importados en stock, etiquetados y listos para entregar',
    whatsappMessage: 'Hola, tengo un taller y quiero consultar por la compra de cristales y láminas por mayor.',
  },
  {
    id: 'domicilio',
    title: 'Servicio a domicilio',
    description: 'Servicio a domicilio sin costo en Piriápolis, Maldonado, San Carlos y Rocha.',
    bullets: ['Sin costo en esas cuatro zonas', 'Para otras zonas, consultanos'],
    image: 'colocacion-parabrisas',
    imageAlt: 'Dos técnicos colocando un parabrisas nuevo en un vehículo blanco',
    quote: { service: 'Cambio de parabrisas', location: 'domicilio', source: 'servicio' },
  },
];
