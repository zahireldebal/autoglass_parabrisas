import { SECURITY_FILM_TINT, type TintValue } from '@/data/options';

/** 'none' = sin lámina · '20' = con lámina de seguridad Security Film (20 %). */
export type TintChoice = TintValue | 'none';
export type SimView = 'exterior' | 'interior' | 'windshield';

export type SimState = {
  tint: TintChoice;
  /** La lámina se aplica a todos los vidrios, incluido el parabrisas. */
  includeWindshield: boolean;
  view: SimView;
  windshield: 'antes' | 'despues';
};

export const initialSimState: SimState = {
  tint: SECURITY_FILM_TINT.value,
  includeWindshield: true,
  view: 'exterior',
  windshield: 'antes',
};

/** Opacidad visual del vidrio (aproximación: menos luz transmitida = vidrio más opaco). */
export function glassOpacity(tint: TintChoice): number {
  if (tint === 'none') return 0.16;
  return Math.min(0.96, 0.16 + (1 - SECURITY_FILM_TINT.vlt) * 0.84);
}

/** Color del vidrio: original (levemente verdoso) o con lámina. */
export const GLASS_COLOR = {
  clear: '#13201f',
  film: '#050607',
} as const;

export function glassColor(tint: TintChoice) {
  return tint === 'none' ? GLASS_COLOR.clear : GLASS_COLOR.film;
}

export function tintLabel(tint: TintChoice) {
  if (tint === 'none') return { label: 'Sin lámina', short: 'Vidrio original', description: 'Así se ve tu vehículo sin lámina.' };
  return {
    label: SECURITY_FILM_TINT.label,
    short: 'Lámina de seguridad',
    description: 'Security Film: privacidad y protección. Mantiene el vidrio unido ante un impacto y dificulta el ingreso al vehículo.',
  };
}
