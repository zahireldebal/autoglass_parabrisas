import { FILM_TYPES, TINT_LEVELS, type FilmValue, type TintValue } from '@/data/options';

export type TintChoice = TintValue | 'none';
export type SimView = 'exterior' | 'interior' | 'windshield';

export type SimState = {
  tint: TintChoice;
  film: FilmValue;
  includeWindshield: boolean;
  view: SimView;
  windshield: 'antes' | 'despues';
};

export const initialSimState: SimState = {
  tint: '35',
  film: 'window-films',
  includeWindshield: false,
  view: 'exterior',
  windshield: 'antes',
};

/** Opacidad visual del vidrio para cada tono (aproximación: VLT bajo = vidrio más opaco). */
export function glassOpacity(tint: TintChoice): number {
  if (tint === 'none') return 0.16;
  const level = TINT_LEVELS.find((t) => t.value === tint);
  const vlt = level?.vlt ?? 0.5;
  return Math.min(0.96, 0.16 + (1 - vlt) * 0.84);
}

/** Matiz sutil por tipo de lámina (representación aproximada). */
export const FILM_TINT_COLOR: Record<FilmValue | 'clear', string> = {
  clear: '#13201f', // vidrio sin lámina (levemente verdoso)
  'window-films': '#050607',
  'nano-ceramico': '#03070b',
  'nano-carbon-hp': '#0a0806',
};

export function tintLabel(tint: TintChoice) {
  if (tint === 'none') return { label: 'Sin polarizar', short: 'Vidrio original', description: 'Así se ve tu auto sin lámina.' };
  const l = TINT_LEVELS.find((t) => t.value === tint)!;
  return { label: l.label, short: l.short, description: l.description };
}

export function filmLabel(film: FilmValue) {
  return FILM_TYPES.find((f) => f.value === film)!;
}
