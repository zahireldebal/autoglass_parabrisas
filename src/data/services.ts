import type { ServiceOption } from './options';

export type Service = {
  id: string;
  title: string;
  /** Servicio que se preselecciona en el formulario al tocar "Consultar". */
  formService: ServiceOption;
  description: string;
  bullets: string[];
  image: string; // nombre base en /public/img (sin tamaño ni extensión)
  imageAlt: string;
  /** true = la imagen es ilustrativa (no es un trabajo real). */
  illustrative?: boolean;
  showFilms?: boolean;
};

export const services: Service[] = [
  {
    id: 'venta-importacion',
    title: 'Venta e importación de cristales',
    formService: 'Compra de cristal',
    description:
      'Somos importadores directos: tenemos stock de cristales para todas las marcas y modelos, y si no lo tenemos, lo conseguimos.',
    bullets: ['Autos, camionetas y camiones', 'Colocación GRATIS con la compra del cristal'],
    image: 'stock-parabrisas',
    imageAlt: 'Estanterías del taller con decenas de parabrisas en stock',
  },
  {
    id: 'cambio-parabrisas',
    title: 'Cambio de parabrisas',
    formService: 'Cambio de parabrisas',
    description:
      'Rajadura, impacto o filtraciones de agua: cambiamos tu parabrisas con colocación profesional y seguís camino en el día.',
    bullets: ['Sin turno: llegás y lo resolvemos', 'Con garantía de colocación'],
    image: 'cambio-parabrisas',
    imageAlt: 'Técnico de Autoglass sellando un parabrisas nuevo en el taller',
  },
  {
    id: 'lunetas-laterales',
    title: 'Lunetas y vidrios laterales',
    formService: 'Luneta',
    description:
      'Luneta, puertas delanteras o traseras: decinos cuál es y te cotizamos el cristal exacto para tu vehículo.',
    bullets: ['Si tenés dudas, mandanos una foto', 'A domicilio sin costo en la zona'],
    image: 'luneta-nivus',
    imageAlt: 'Volkswagen Nivus blanco visto desde atrás, con su luneta, dentro del taller',
  },
  {
    id: 'polarizado',
    title: 'Polarizado',
    formService: 'Polarizado',
    description:
      'Más privacidad, menos calor y menos encandilamiento. Elegí el tono y la lámina; te asesoramos sobre qué conviene.',
    bullets: ['Tonos del 70 % al 5 %', 'Probalo en el simulador 3D'],
    image: 'polarizado-render',
    imageAlt: 'Render ilustrativo de un sedán oscuro con vidrios polarizados',
    illustrative: true,
    showFilms: true,
  },
  {
    id: 'laminas-seguridad',
    title: 'Láminas de seguridad',
    formService: 'Láminas de seguridad',
    description:
      'Una barrera extra: la lámina ayuda a mantener el vidrio unido ante un impacto y dificulta el ingreso al vehículo.',
    bullets: ['Más seguridad ante robos', 'Para lunetas y laterales'],
    image: 'lamina-seguridad',
    imageAlt: 'Técnico aplicando lámina de seguridad sobre una luneta con pistola de calor',
  },
];
