import { useCallback, useEffect, useRef, useState } from 'react';

export type CameraDevice = {
  deviceId: string;
  label: string;
};

export type CameraStatus = 'idle' | 'loading' | 'ready' | 'denied' | 'error';

export type UseCameraResult = {
  videoRef: React.RefObject<HTMLVideoElement>;
  devices: CameraDevice[];
  activeDeviceId: string | null;
  setActiveDeviceId: (id: string) => void;
  status: CameraStatus;
  errorMessage: string | null;
  start: () => void;
};

export function useCamera(): UseCameraResult {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [devices, setDevices] = useState<CameraDevice[]>([]);
  const [activeDeviceId, setActiveDeviceId] = useState<string | null>(null);
  const [status, setStatus] = useState<CameraStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refreshDevices = useCallback(async () => {
    const list = await navigator.mediaDevices.enumerateDevices();
    const cams = list
      .filter((d) => d.kind === 'videoinput')
      .map((d, i) => ({
        deviceId: d.deviceId,
        label: d.label || `Camera ${i + 1}`,
      }));
    setDevices(cams);
    return cams;
  }, []);

  const stopCurrent = useCallback(() => {
    const s = streamRef.current;
    if (s) {
      s.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (status === 'loading' || status === 'ready') return;
    setErrorMessage(null);
    setStatus('loading');

    (async () => {
      try {
        const initial = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = initial;
        if (videoRef.current) videoRef.current.srcObject = initial;

        const cams = await refreshDevices();
        const currentId =
          initial.getVideoTracks()[0]?.getSettings().deviceId ?? cams[0]?.deviceId ?? null;
        setActiveDeviceId(currentId);
        setStatus('ready');
      } catch (err) {
        const name = (err as DOMException)?.name;
        if (name === 'NotAllowedError' || name === 'SecurityError') {
          setStatus('denied');
        } else {
          setStatus('error');
          setErrorMessage((err as Error)?.message ?? 'Camera error');
        }
      }
    })();
  }, [status, refreshDevices]);

  // Stop tracks on unmount + react to device list changes (only while running).
  useEffect(() => {
    const onDeviceChange = () => {
      if (streamRef.current) refreshDevices();
    };
    navigator.mediaDevices.addEventListener?.('devicechange', onDeviceChange);
    return () => {
      navigator.mediaDevices.removeEventListener?.('devicechange', onDeviceChange);
      stopCurrent();
    };
  }, [refreshDevices, stopCurrent]);

  // Switch when activeDeviceId changes (only if already running).
  useEffect(() => {
    if (!activeDeviceId) return;
    if (!streamRef.current) return;
    const current = streamRef.current.getVideoTracks()[0]?.getSettings().deviceId;
    if (current === activeDeviceId) return;

    let cancelled = false;
    (async () => {
      setStatus('loading');
      try {
        stopCurrent();
        const next = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: activeDeviceId } },
          audio: false,
        });
        if (cancelled) {
          next.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = next;
        if (videoRef.current) videoRef.current.srcObject = next;
        setStatus('ready');
      } catch (err) {
        if (cancelled) return;
        setStatus('error');
        setErrorMessage((err as Error)?.message ?? 'Camera error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeDeviceId, stopCurrent]);

  return { videoRef, devices, activeDeviceId, setActiveDeviceId, status, errorMessage, start };
}
