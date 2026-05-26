import { useCallback, useEffect, useRef, useState } from 'react';

export type CameraDevice = {
  deviceId: string;
  label: string;
};

export type CameraStatus = 'idle' | 'loading' | 'ready' | 'denied' | 'error';

export type UseCameraResult = {
  stream: MediaStream | null;
  devices: CameraDevice[];
  activeDeviceId: string | null;
  setActiveDeviceId: (id: string) => void;
  status: CameraStatus;
  errorMessage: string | null;
  start: () => void;
};

export function useCamera(): UseCameraResult {
  const streamRef = useRef<MediaStream | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

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
      setStream(null);
    }
  }, []);

  const start = useCallback(() => {
    if (status === 'loading' || status === 'ready') return;
    console.log('[camera] start()');
    setErrorMessage(null);
    setStatus('loading');

    (async () => {
      try {
        const next = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        console.log('[camera] getUserMedia ok, tracks:', next.getVideoTracks().length);
        streamRef.current = next;
        setStream(next);

        const cams = await refreshDevices();
        const currentId =
          next.getVideoTracks()[0]?.getSettings().deviceId ?? cams[0]?.deviceId ?? null;
        setActiveDeviceId(currentId);
        setStatus('ready');
      } catch (err) {
        console.error('[camera] start() failed', err);
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

  // Pre-permission enumerate so dropdown shows entries (labels stay empty
  // until permission is granted — browser security).
  useEffect(() => {
    refreshDevices().catch(() => undefined);
    const onDeviceChange = () => {
      refreshDevices().catch(() => undefined);
    };
    navigator.mediaDevices.addEventListener?.('devicechange', onDeviceChange);
    return () => {
      navigator.mediaDevices.removeEventListener?.('devicechange', onDeviceChange);
    };
  }, [refreshDevices]);

  // Stop tracks on unmount only — not on every effect re-run.
  useEffect(() => {
    return () => {
      const s = streamRef.current;
      if (s) {
        s.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

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
        setStream(next);
        setStatus('ready');
      } catch (err) {
        if (cancelled) return;
        console.error('[camera] switch failed', err);
        setStatus('error');
        setErrorMessage((err as Error)?.message ?? 'Camera error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeDeviceId, stopCurrent]);

  return { stream, devices, activeDeviceId, setActiveDeviceId, status, errorMessage, start };
}
