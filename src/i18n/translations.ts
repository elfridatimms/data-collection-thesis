export type Language = 'hr' | 'en';

export type Mode = 'elbow' | 'wrist' | 'fingers';

export type ExerciseId =
  | 'elbow.flexionExtension'
  | 'wrist.flexionExtension'
  | 'wrist.radialUlnar'
  | 'fingers.grip'
  | 'fingers.singleFlex';

export const EXERCISES_BY_MODE: Record<Mode, ExerciseId[]> = {
  elbow: ['elbow.flexionExtension'],
  wrist: ['wrist.flexionExtension', 'wrist.radialUlnar'],
  fingers: ['fingers.grip', 'fingers.singleFlex'],
};

type Dictionary = {
  appTitle: string;
  exercises: string;
  selectCamera: string;
  noCameras: string;
  language: string;
  cameraPermissionDenied: string;
  cameraLoading: string;
  modes: Record<Mode, string>;
  exerciseNames: Record<ExerciseId, string>;
};

export const translations: Record<Language, Dictionary> = {
  hr: {
    appTitle: 'Rehab Tracker',
    exercises: 'Vježbe',
    selectCamera: 'Odaberi kameru',
    noCameras: 'Nema dostupnih kamera',
    language: 'Jezik',
    cameraPermissionDenied: 'Pristup kameri je odbijen. Dozvoli pristup u postavkama preglednika.',
    cameraLoading: 'Učitavanje kamere…',
    modes: {
      elbow: 'Lakat',
      wrist: 'Zglob',
      fingers: 'Prsti',
    },
    exerciseNames: {
      'elbow.flexionExtension': 'Fleksija – ekstenzija',
      'wrist.flexionExtension': 'Fleksija – ekstenzija',
      'wrist.radialUlnar': 'Radijalna / ulnarna devijacija',
      'fingers.grip': 'Stisak (otvori / zatvori)',
      'fingers.singleFlex': 'Pojedinačna fleksija',
    },
  },
  en: {
    appTitle: 'Rehab Tracker',
    exercises: 'Exercises',
    selectCamera: 'Select camera',
    noCameras: 'No cameras available',
    language: 'Language',
    cameraPermissionDenied: 'Camera access denied. Enable it in your browser settings.',
    cameraLoading: 'Loading camera…',
    modes: {
      elbow: 'Elbow',
      wrist: 'Wrist',
      fingers: 'Fingers',
    },
    exerciseNames: {
      'elbow.flexionExtension': 'Flexion – extension',
      'wrist.flexionExtension': 'Flexion – extension',
      'wrist.radialUlnar': 'Radial / ulnar deviation',
      'fingers.grip': 'Grip (open / close)',
      'fingers.singleFlex': 'Single-finger flexion',
    },
  },
};
