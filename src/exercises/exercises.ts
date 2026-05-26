import type { Mode, Language } from '../i18n/translations';

export type Feasibility = 'DA' | 'DJELOMICNO' | 'NE';

export type Exercise = {
  id: string;
  mode: Mode;
  name_en: string;
  name_hr: string;
  feasibility: Feasibility;
};

export const EXERCISES: Exercise[] = [
  // Elbow
  {
    id: 'elbow.flex_ext',
    mode: 'elbow',
    name_en: 'Elbow flexion/extension',
    name_hr: 'Fleksija/ekstenzija lakta',
    feasibility: 'DA',
  },

  // Wrist
  {
    id: 'wrist.flex_ext',
    mode: 'wrist',
    name_en: 'Wrist flexion/extension',
    name_hr: 'Fleksija/ekstenzija zgloba',
    feasibility: 'DA',
  },
  {
    id: 'wrist.radial_ulnar',
    mode: 'wrist',
    name_en: 'Radial/ulnar deviation',
    name_hr: 'Radijalna/ulnarna devijacija',
    feasibility: 'DA',
  },
  {
    id: 'wrist.rotations',
    mode: 'wrist',
    name_en: 'Wrist rotations',
    name_hr: 'Kružne rotacije zgloba',
    feasibility: 'DJELOMICNO',
  },
  {
    id: 'wrist.stretch',
    mode: 'wrist',
    name_en: 'Wrist stretch',
    name_hr: 'Istezanje zgloba',
    feasibility: 'DJELOMICNO',
  },
  {
    id: 'wrist.flex_ext_stretch',
    mode: 'wrist',
    name_en: 'Wrist flexor/extensor stretch',
    name_hr: 'Istezanje fleksora/ekstenzora zgloba',
    feasibility: 'DJELOMICNO',
  },
  {
    id: 'wrist.curls',
    mode: 'wrist',
    name_en: 'Wrist curls',
    name_hr: 'Pregibi zgloba',
    feasibility: 'DJELOMICNO',
  },
  {
    id: 'wrist.prayer_stretch',
    mode: 'wrist',
    name_en: 'Prayer stretch',
    name_hr: 'Istezanje u molitvenom položaju',
    feasibility: 'DJELOMICNO',
  },
  {
    id: 'wrist.pron_sup',
    mode: 'wrist',
    name_en: 'Forearm pronation/supination',
    name_hr: 'Pronacija/supinacija podlaktice',
    feasibility: 'NE',
  },

  // Fingers
  {
    id: 'fingers.fist',
    mode: 'fingers',
    name_en: 'Fist making',
    name_hr: 'Stiskanje šake',
    feasibility: 'DA',
  },
  {
    id: 'fingers.extension',
    mode: 'fingers',
    name_en: 'Finger extension',
    name_hr: 'Ekstenzija prstiju',
    feasibility: 'DA',
  },
  {
    id: 'fingers.tendon_glides',
    mode: 'fingers',
    name_en: 'Active finger flexor tendon glides',
    name_hr: 'Klizanje tetiva fleksora prstiju',
    feasibility: 'DJELOMICNO',
  },
  {
    id: 'fingers.stretch',
    mode: 'fingers',
    name_en: 'Finger stretch',
    name_hr: 'Istezanje prstiju',
    feasibility: 'DJELOMICNO',
  },
  {
    id: 'fingers.passive_flex',
    mode: 'fingers',
    name_en: 'Passive finger flexion',
    name_hr: 'Pasivna fleksija prstiju',
    feasibility: 'NE',
  },
];

const FEASIBILITY_ORDER: Record<Feasibility, number> = {
  DA: 0,
  DJELOMICNO: 1,
  NE: 2,
};

export function exercisesForMode(mode: Mode): Exercise[] {
  return EXERCISES.filter((e) => e.mode === mode).sort((a, b) => {
    const o = FEASIBILITY_ORDER[a.feasibility] - FEASIBILITY_ORDER[b.feasibility];
    if (o !== 0) return o;
    return a.name_en.localeCompare(b.name_en);
  });
}

export function exerciseName(ex: Exercise, language: Language): string {
  return language === 'hr' ? ex.name_hr : ex.name_en;
}
