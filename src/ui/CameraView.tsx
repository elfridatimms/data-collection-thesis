import { forwardRef, useEffect, useRef, type RefObject } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import type { CameraStatus } from '../camera/useCamera';

type Props = {
  status: CameraStatus;
  errorMessage: string | null;
  onStart: () => void;
  canvasRef: RefObject<HTMLCanvasElement>;
  landmarkCount: number;
};

export const CameraView = forwardRef<HTMLVideoElement, Props>(function CameraView(
  { status, errorMessage, onStart, canvasRef, landmarkCount },
  videoForwardRef,
) {
  const { t } = useLanguage();
  const showVideo = status === 'ready' || status === 'loading';
  const innerVideoRef = useRef<HTMLVideoElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);

  // Sync the frame's aspect-ratio with the actual webcam stream so video and
  // canvas overlay align pixel-for-pixel.
  useEffect(() => {
    const v = innerVideoRef.current;
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
  }, [showVideo]);

  const setVideoRef = (el: HTMLVideoElement | null) => {
    innerVideoRef.current = el;
    if (typeof videoForwardRef === 'function') videoForwardRef(el);
    else if (videoForwardRef) videoForwardRef.current = el;
  };

  return (
    <div className="camera">
      <div className="camera__frame" ref={frameRef}>
        {showVideo && (
          <>
            <video ref={setVideoRef} className="camera__video" autoPlay playsInline muted />
            <canvas ref={canvasRef} className="camera__canvas" />
          </>
        )}

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
});
