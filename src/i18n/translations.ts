export type Language = 'hr' | 'en';

export type Mode = 'elbow' | 'wrist' | 'fingers';

type Dictionary = {
  appTitle: string;
  exercises: string;
  selectCamera: string;
  noCameras: string;
  language: string;
  cameraPermissionDenied: string;
  cameraLoading: string;
  startCamera: string;
  cameraIdleHint: string;
  landmarksDetected: string;
  modes: Record<Mode, string>;
  feasibility: {
    DA: string;
    DJELOMICNO: string;
    NE: string;
  };
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
    startCamera: 'Pokreni kameru',
    cameraIdleHint: 'Klikni za uključivanje kamere',
    landmarksDetected: 'Točke',
    modes: {
      elbow: 'Lakat',
      wrist: 'Zglob',
      fingers: 'Prsti',
    },
    feasibility: {
      DA: 'Moguće',
      DJELOMICNO: 'Djelomično',
      NE: 'Nije moguće',
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
    startCamera: 'Start camera',
    cameraIdleHint: 'Click to turn the camera on',
    landmarksDetected: 'Landmarks',
    modes: {
      elbow: 'Elbow',
      wrist: 'Wrist',
      fingers: 'Fingers',
    },
    feasibility: {
      DA: 'Feasible',
      DJELOMICNO: 'Partial',
      NE: 'Not feasible',
    },
  },
};
