import { useState } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import type { Mode } from './i18n/translations';
import { useCamera } from './camera/useCamera';
import { Layout } from './ui/Layout';
import { Sidebar } from './ui/Sidebar';
import { TopBar } from './ui/TopBar';
import { CameraView } from './ui/CameraView';

function AppInner() {
  const [mode, setMode] = useState<Mode>('elbow');
  const { videoRef, devices, activeDeviceId, setActiveDeviceId, status, errorMessage } = useCamera();

  return (
    <Layout
      sidebar={<Sidebar mode={mode} />}
      topbar={
        <TopBar
          mode={mode}
          onModeChange={setMode}
          devices={devices}
          activeDeviceId={activeDeviceId}
          onDeviceChange={setActiveDeviceId}
        />
      }
      main={<CameraView ref={videoRef} status={status} errorMessage={errorMessage} />}
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
