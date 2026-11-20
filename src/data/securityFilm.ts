/**
 * Lámina de seguridad Security Film. Datos transcritos TEXTUALMENTE de la ficha de la marca
 * (nuevasfotos/securityfilm.png). No agregar datos que no estén en la ficha.
 * Se omiten a propósito los datos de contacto del fabricante (Instagram, teléfono y web):
 * las consultas van al WhatsApp de Autoglass.
 */

/** Paleta de la marca (sacada de la ficha): negro, blanco y azul. */
export const SF_COLORS = { black: '#000000', white: '#ffffff', blue: '#0173C7' } as const;

export const securityFilm = {
  name: 'Security Film',
  subtitle: 'Professional Safety Window Film',
  tagline: ['Protection', 'Safety', 'Performance'],

  /** Especificaciones (columna izquierda de la ficha). */
  specs: [
    { id: 'espesor', label: 'Espesor de la lámina', value: '4 MIL (100 micrones)' },
    { id: 'uv', label: 'Porcentaje de rechazo UV', value: '99 %' },
    { id: 'luz', label: 'Porcentaje de transmisión de luz', value: '20 %' },
    { id: 'ir', label: 'Porcentaje de rechazo IR', value: '60 %' },
    { id: 'calor', label: 'Reducción de calor', value: 'Mejora el confort interior' },
    { id: 'fragmentos', label: 'Retención de fragmentos', value: 'Ayuda a mantener unidos los fragmentos de vidrio' },
    { id: 'transparencia', label: 'Alta transparencia', value: 'Excelente claridad óptica' },
    { id: 'uso', label: 'Uso', value: 'Automotriz y arquitectónico' },
  ],

  /** Beneficios (columna derecha de la ficha). */
  benefits: [
    'Mayor seguridad ante impactos',
    'Protección contra rayos UV',
    'Reducción de calor y consumo energético',
    'Ayuda a mantener unidos los fragmentos de vidrio',
    'Mayor confort y privacidad',
    'Bloqueo de radiación solar (IR)',
    'Instalación profesional',
  ],

  /** Datos destacados (franja de "Especificaciones técnicas" de la ficha). */
  highlights: [
    { value: '99 %', label: 'Rechazo UV' },
    { value: '20 %', label: 'Transmisión de luz' },
    { value: '60 %', label: 'Rechazo IR' },
    { value: '100', label: 'Micrones de espesor (4 MIL)' },
    { value: '5 años', label: 'Garantía' },
  ],

  /** Ficha del rollo. */
  product: [
    { label: 'Modelo', value: 'SF-100' },
    { label: 'Ancho', value: '1.52 m' },
    { label: 'Largo', value: '60 m' },
    { label: 'Medidas del rollo', value: '1.52 m x 60 m' },
    { label: 'Origen', value: 'Imported technology' },
    { label: 'Garantía', value: '5 años' },
  ],

  /** Sellos de la parte inferior de la ficha. */
  badges: ['Safety window film', '99 % UV protection', 'Impact resistance', 'Professional grade'],
} as const;

export const SECURITY_FILM_WHATSAPP = 'Hola, quiero consultar por la lámina de seguridad Security Film.';
