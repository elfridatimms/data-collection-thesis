import { useRef, useState } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import type { Mode } from './i18n/translations';
import { useCamera } from './camera/useCamera';
import { useTracker } from './mediapipe/useTracker';
import { Layout } from './ui/Layout';
import { Sidebar } from './ui/Sidebar';
import { TopBar } from './ui/TopBar';
import { CameraView } from './ui/CameraView';

function AppInner() {
  const [mode, setMode] = useState<Mode>('elbow');
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);

  const { videoRef, devices, activeDeviceId, setActiveDeviceId, status, errorMessage, start } =
    useCamera();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { landmarkCount } = useTracker({
    videoRef,
    canvasRef,
    mode,
    enabled: status === 'ready',
  });

  const handleModeChange = (m: Mode) => {
    setMode(m);
    setSelectedExerciseId(null);
  };

  return (
    <Layout
      sidebar={
        <Sidebar
          mode={mode}
          selectedExerciseId={selectedExerciseId}
          onSelectExercise={setSelectedExerciseId}
        />
      }
      topbar={
        <TopBar
          mode={mode}
          onModeChange={handleModeChange}
          devices={devices}
          activeDeviceId={activeDeviceId}
          onDeviceChange={setActiveDeviceId}
        />
      }
      main={
        <CameraView
          ref={videoRef}
          status={status}
          errorMessage={errorMessage}
          onStart={start}
          canvasRef={canvasRef}
          landmarkCount={landmarkCount}
        />
      }
    />
  );
}

export function App() {
  return (
    <LanguageProvider>
      <AppInner />
    </LanguageProvider>
  );
}
