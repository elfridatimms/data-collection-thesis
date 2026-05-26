import { useEffect, useRef, type RefObject } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import type { CameraStatus } from '../camera/useCamera';

type Props = {
  stream: MediaStream | null;
  status: CameraStatus;
  errorMessage: string | null;
  onStart: () => void;
  videoRef: RefObject<HTMLVideoElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  landmarkCount: number;
};

export function CameraView({
  stream,
  status,
  errorMessage,
  onStart,
  videoRef,
  canvasRef,
  landmarkCount,
}: Props) {
  const { t } = useLanguage();
  const frameRef = useRef<HTMLDivElement | null>(null);

  // Attach stream to <video> whenever either side changes.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (v.srcObject !== stream) {
      v.srcObject = stream;
      console.log('[CameraView] srcObject set, has stream:', !!stream);
    }

    if (stream) {
      const play = () =>
        v.play().catch((err) => console.error('[CameraView] play() failed', err));
      if (v.readyState >= 2) play();
      else v.addEventListener('loadedmetadata', play, { once: true });
    }
  }, [stream, videoRef]);

  // Sync the frame's aspect-ratio with the actual webcam resolution.
  useEffect(() => {
    const v = videoRef.current;
    const frame = frameRef.current;
    if (!v || !frame) return;

    const apply = () => {
      if (v.videoWidth && v.videoHeight) {
        frame.style.aspectRatio = `${v.videoWidth} / ${v.videoHeight}`;
      }
    };
    apply();
    v.addEventListener('loadedmetadata', apply);
    return () => v.removeEventListener('loadedmetadata', apply);
  }, [videoRef, stream]);

  return (
    <div className="camera">
      <div className="camera__frame" ref={frameRef}>
        <video ref={videoRef} className="camera__video" autoPlay playsInline muted />
        <canvas ref={canvasRef} className="camera__canvas" />

        {status === 'ready' && (
          <div className="camera__badge">
            {t.landmarksDetected}: {landmarkCount}
          </div>
        )}

        {status === 'idle' && (
          <div className="camera__overlay">
            <span>{t.cameraIdleHint}</span>
            <button type="button" className="camera__start" onClick={onStart}>
              {t.startCamera}
            </button>
          </div>
        )}

        {status === 'loading' && <div className="camera__overlay">{t.cameraLoading}</div>}

        {status === 'denied' && (
          <div className="camera__overlay">
            <span>{t.cameraPermissionDenied}</span>
            <button type="button" className="camera__start" onClick={onStart}>
              {t.startCamera}
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="camera__overlay">
            <span>{errorMessage ?? 'Camera error'}</span>
            <button type="button" className="camera__start" onClick={onStart}>
              {t.startCamera}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
