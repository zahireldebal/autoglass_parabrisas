/**
 * DATOS DEL NEGOCIO — único archivo a editar para cambiar teléfonos, dirección,
 * horarios, zonas, etc. Todo el sitio (textos, JSON-LD, formulario, mensaje de
 * WhatsApp, footer) lee de acá.
 */

/**
 * URL pública del sitio: ÚNICO lugar donde se define. De acá salen el canonical,
 * og:url, og:image, twitter:image, sitemap.xml, robots.txt y el JSON-LD.
 * Mientras el sitio vive en Netlify, queda la URL de Netlify.
 * Cuando llegue el dominio definitivo: definí NEXT_PUBLIC_SITE_URL en Netlify
 * (recomendado) o cambiá DEFAULT_SITE_URL acá. Ver README → "Dominio final".
 */
const DEFAULT_SITE_URL = 'https://autoglassparabriss.netlify.app';
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '');

export const business = {
  name: 'Autoglass Parabrisas',
  shortName: 'Autoglass',
  tagline: 'Tu seguridad primero',
  description:
    'Importación, venta y colocación de cristales automotrices para autos, camionetas y camiones en Maldonado: parabrisas, lunetas, vidrios de puerta, laterales y aletas, y láminas de seguridad Security Film. Venta mayorista para talleres. Colocación sin costo con la compra del cristal y servicio a domicilio con agenda, sin cargo en Piriápolis, Maldonado y San Carlos. Parabrisas con tu seguro.',

  /** WhatsApp: solo dígitos, con código de país (Uruguay = 598). Se usa en TODOS los botones. */
  whatsapp: '59896126160',
  whatsappDisplay: '096 126 160',
  /** Teléfono fijo: visible en contacto y footer. */
  phone: '+59842251708',
  phoneDisplay: '4225 1708',

  instagram: {
    handle: '@parabrisas_autoglass_',
    url: 'https://www.instagram.com/parabrisas_autoglass_/',
  },

  address: {
    street: 'Manuel Ledesma esq. 18 de Julio',
    locality: 'Maldonado',
    region: 'Maldonado',
    postalCode: '20000',
    country: 'UY',
    countryName: 'Uruguay',
  },
  city: 'Maldonado',
  geo: { lat: -34.9135402, lng: -54.958989 },
  /** Ficha de Google Maps (reseñas). */
  mapsUrl:
    'https://www.google.com/maps/place/Parabrisas+Autoglass/@-34.9135358,-54.9615639,17z/data=!4m6!3m5!1s0x95751b81fabd1d53:0xd3a88eca0cccf295!8m2!3d-34.9135402!4d-54.958989!16s%2Fg%2F11rcl0vpz2',
  /** Abre Google Maps con la ruta hasta el taller. */
  directionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=-34.9135402,-54.958989',
  /** Iframe embebido (sin API key). */
  mapEmbedUrl: 'https://www.google.com/maps?q=-34.9135402,-54.958989&z=16&hl=es&output=embed',

  google: { rating: 4.5, reviewCount: 176 },

  /** Horarios. day: 0=domingo … 6=sábado. `null` = cerrado. */
  hours: [
    { day: 1, label: 'Lunes', open: '08:00', close: '18:30' },
    { day: 2, label: 'Martes', open: '08:00', close: '18:30' },
    { day: 3, label: 'Miércoles', open: '08:00', close: '18:30' },
    { day: 4, label: 'Jueves', open: '08:00', close: '18:30' },
    { day: 5, label: 'Viernes', open: '08:00', close: '18:30' },
    { day: 6, label: 'Sábado', open: '08:00', close: '13:00' },
    { day: 0, label: 'Domingo', open: null, close: null },
  ] as { day: number; label: string; open: string | null; close: string | null }[],
  hoursSummary: ['Lunes a viernes: 8:00 a 18:30', 'Sábados: 8:00 a 13:00', 'Domingos: cerrado'],

  /** ¿Trabajan con seguros? Si es false, se ocultan el bloque y el campo del formulario. */
  worksWithInsurance: true,
  /** Aseguradoras con las que trabajan (se muestran como texto, sin logos). */
  insurers: ['Mapfre', 'Porto Seguro', 'SURA', 'Sancor Seguros', 'Surco', 'Berkley', 'San Cristóbal', 'HDI'],
  /** ¿Van a domicilio? Si es false, se oculta la opción en el formulario. A domicilio es SIEMPRE con agenda previa. */
  homeService: true,
  /** Zonas donde el domicilio es SIN COSTO. */
  homeServiceZones: ['Piriápolis', 'Maldonado', 'San Carlos'],
  /** Otras zonas a las que también van (con costo: en la web NO se menciona el precio, solo que llegan). */
  homeServiceOtherZones: ['Rocha'],
  /** Días de recorrido por zona, tal cual el flyer de la clienta ("Para estar más cerca tuyo"). */
  homeServiceDays: [
    { zone: 'Maldonado', days: 'Todos los días' },
    { zone: 'San Carlos', days: 'Lunes y jueves' },
    { zone: 'Piriápolis y Pan de Azúcar', days: 'Miércoles' },
    { zone: 'Rocha ciudad', days: 'Viernes' },
  ],
  installments: 'Hasta 6 pagos con todas las tarjetas',
  /** Tiempo de cambio publicado. PENDIENTE de confirmar (ver PENDIENTES.md). */
  replacementTime: 'en menos de 1 hora',

  /** Crédito del modelo 3D (licencia CC BY 4.0: obligatorio mostrarlo). */
  modelCredit: {
    text: 'Modelo 3D: Generic Sedan Car por Márcio Meireles · CC BY 4.0',
    url: 'https://sketchfab.com/3d-models/generic-sedan-car-58c33766470d46e7b2aed542650494e5',
    licenseUrl: 'http://creativecommons.org/licenses/by/4.0/',
  },

  credits: '© 2026 Autoglass Parabrisas · Diseño y desarrollo: ZAJUX · Todos los derechos reservados.',
} as const;

export const telHref = `tel:${business.phone}`;

/** "a, b y c" */
export const joinList = (items: readonly string[]) => items.join(', ').replace(/, ([^,]*)$/, ' y $1');

/** Zonas sin costo, en texto: "Piriápolis, Maldonado y San Carlos". */
export const homeServiceFreeZones = joinList(business.homeServiceZones);
/** "También llegamos a Rocha." (sin hablar de precio) */
export const homeServiceAlso = business.homeServiceOtherZones.length ? `También llegamos a ${joinList(business.homeServiceOtherZones)}.` : '';
