import { forwardRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import type { CameraStatus } from '../camera/useCamera';

type Props = {
  status: CameraStatus;
  errorMessage: string | null;
};

export const CameraView = forwardRef<HTMLVideoElement, Props>(function CameraView(
  { status, errorMessage },
  ref,
) {
  const { t } = useLanguage();

  return (
    <div className="camera">
      <video
        ref={ref}
        className="camera__video"
        autoPlay
        playsInline
        muted
      />
      {status === 'loading' && <div className="camera__overlay">{t.cameraLoading}</div>}
      {status === 'denied' && <div className="camera__overlay">{t.cameraPermissionDenied}</div>}
      {status === 'error' && (
        <div className="camera__overlay">{errorMessage ?? 'Camera error'}</div>
      )}
    </div>
  );
});
