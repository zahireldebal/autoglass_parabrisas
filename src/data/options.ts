/**
 * Opciones compartidas entre el formulario, el simulador y el mensaje de WhatsApp.
 */

export const SERVICE_OPTIONS = [
  'Cambio de parabrisas',
  'Luneta',
  'Vidrio lateral',
  'Láminas de seguridad',
  'Compra de cristal',
  'Otro',
] as const;
export type ServiceOption = (typeof SERVICE_OPTIONS)[number];

/**
 * Lámina de seguridad Security Film SF-100: un solo tono.
 * 20 % = porcentaje de transmisión de luz (dato de la ficha de Security Film).
 */
export const SECURITY_FILM_TINT = { value: '20', label: '20 %', vlt: 0.2 } as const;
export type TintValue = typeof SECURITY_FILM_TINT.value;

export const GLASS_SCOPE_OPTIONS = [
  { value: 'todos', label: 'Todos los vidrios' },
  { value: 'laterales-luneta', label: 'Laterales y luneta' },
  { value: 'luneta', label: 'Solo luneta' },
  { value: 'asesoramiento', label: 'Quiero asesoramiento' },
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
export type LocationValue = (typeof LOCATION_OPTIONS)[number]['value'];

export const ZONE_OPTIONS = ['Piriápolis', 'Maldonado', 'San Carlos', 'Rocha', 'Otra'] as const;
