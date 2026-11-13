/**
 * Opciones compartidas entre el formulario, el simulador y el mensaje de WhatsApp.
 */

export const SERVICE_OPTIONS = [
  'Cambio de parabrisas',
  'Luneta',
  'Vidrio lateral',
  'Polarizado',
  'Láminas de seguridad',
  'Compra de cristal',
  'Otro',
] as const;
export type ServiceOption = (typeof SERVICE_OPTIONS)[number];

/** Tonos de polarizado = % de luz que deja pasar (VLT). Menor % = más oscuro. */
export const TINT_LEVELS = [
  { value: '70', label: '70 %', vlt: 0.7, short: 'Muy leve', description: 'Apenas se nota: corta reflejos y calor sin cambiar la visibilidad.' },
  { value: '50', label: '50 %', vlt: 0.5, short: 'Leve', description: 'Más confort y menos encandilamiento, con muy buena visibilidad.' },
  { value: '35', label: '35 %', vlt: 0.35, short: 'Medio', description: 'Equilibrio entre privacidad y visibilidad.' },
  { value: '20', label: '20 %', vlt: 0.2, short: 'Privacidad alta', description: 'Desde afuera cuesta ver el interior.' },
  { value: '5', label: '5 %', vlt: 0.05, short: 'Privacidad máxima', description: 'El tono más oscuro: el interior casi no se ve.' },
] as const;
export type TintValue = (typeof TINT_LEVELS)[number]['value'];

export const TINT_FORM_OPTIONS = [
  ...TINT_LEVELS.map((t) => ({ value: t.value, label: t.label })),
  { value: 'asesoramiento', label: 'No sé, quiero asesoramiento' },
] as const;

/**
 * Líneas de lámina que aparecen en el cartel del taller.
 * Descripciones genéricas: las características técnicas están PENDIENTES (ver PENDIENTES.md).
 */
export const FILM_TYPES = [
  { value: 'window-films', label: 'Window Films', description: 'Lámina de polarizado clásica, para privacidad y menos encandilamiento.' },
  { value: 'nano-ceramico', label: 'Nano Cerámico', description: 'Línea cerámica, pensada para un mayor rechazo del calor.' },
  { value: 'nano-carbon-hp', label: 'Nano Carbon HP', description: 'Línea de carbono, con tono estable y terminación prolija.' },
] as const;
export type FilmValue = (typeof FILM_TYPES)[number]['value'];

export const GLASS_SCOPE_OPTIONS = [
  { value: 'todos', label: 'Todos los vidrios' },
  { value: 'laterales-luneta', label: 'Laterales y luneta' },
  { value: 'luneta', label: 'Solo luneta' },
] as const;
export type GlassScope = (typeof GLASS_SCOPE_OPTIONS)[number]['value'];

export const TIME_SLOTS = [
  { value: 'mañana', label: 'Mañana' },
  { value: 'tarde', label: 'Tarde' },
] as const;

export const LOCATION_OPTIONS = [
  { value: 'taller', label: 'En el taller' },
  { value: 'domicilio', label: 'A domicilio' },
] as const;

export const ZONE_OPTIONS = ['Piriápolis', 'Maldonado', 'San Carlos', 'Rocha', 'Otra'] as const;
