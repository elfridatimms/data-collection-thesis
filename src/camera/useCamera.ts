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

  // Initial: ask permission with a generic constraint, then enumerate.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setStatus('loading');
      try {
        const initial = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (cancelled) {
          initial.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = initial;
        if (videoRef.current) videoRef.current.srcObject = initial;

        const cams = await refreshDevices();
        const currentId = initial.getVideoTracks()[0]?.getSettings().deviceId ?? cams[0]?.deviceId ?? null;
        setActiveDeviceId(currentId);
        setStatus('ready');
      } catch (err) {
        if (cancelled) return;
        const name = (err as DOMException)?.name;
        if (name === 'NotAllowedError' || name === 'SecurityError') {
          setStatus('denied');
        } else {
          setStatus('error');
          setErrorMessage((err as Error)?.message ?? 'Camera error');
        }
      }
    })();

    const onDeviceChange = () => {
      refreshDevices();
    };
    navigator.mediaDevices.addEventListener?.('devicechange', onDeviceChange);

    return () => {
      cancelled = true;
      navigator.mediaDevices.removeEventListener?.('devicechange', onDeviceChange);
      stopCurrent();
    };
  }, [refreshDevices, stopCurrent]);

  // Switch when activeDeviceId changes (after initial).
  useEffect(() => {
    if (!activeDeviceId) return;
    const current = streamRef.current?.getVideoTracks()[0]?.getSettings().deviceId;
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

  return { videoRef, devices, activeDeviceId, setActiveDeviceId, status, errorMessage };
}
