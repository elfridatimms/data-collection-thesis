import { useLanguage } from '../i18n/LanguageContext';
import type { Mode } from '../i18n/translations';
import type { CameraDevice } from '../camera/useCamera';

const MODES: Mode[] = ['elbow', 'wrist', 'fingers'];

type Props = {
  mode: Mode;
  onModeChange: (m: Mode) => void;
  devices: CameraDevice[];
  activeDeviceId: string | null;
  onDeviceChange: (id: string) => void;
};

export function TopBar({ mode, onModeChange, devices, activeDeviceId, onDeviceChange }: Props) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="topbar">
      <nav className="topbar__modes" role="tablist" aria-label="modes">
        {MODES.map((m) => {
          const active = m === mode;
          return (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={active}
              className={`topbar__mode${active ? ' topbar__mode--active' : ''}`}
              onClick={() => onModeChange(m)}
            >
              {t.modes[m]}
            </button>
          );
        })}
      </nav>

      <div className="topbar__controls">
        <label className="topbar__field">
          <span className="topbar__label">{t.selectCamera}</span>
          <select
            className="topbar__select"
            value={activeDeviceId ?? ''}
            onChange={(e) => onDeviceChange(e.target.value)}
            disabled={devices.length === 0}
          >
            {devices.length === 0 ? (
              <option value="">{t.noCameras}</option>
            ) : (
              <>
                {activeDeviceId === null && <option value="">—</option>}
                {devices.map((d, i) => (
                  <option key={d.deviceId || `cam-${i}`} value={d.deviceId}>
                    {d.label}
                  </option>
                ))}
              </>
            )}
          </select>
        </label>

        <label className="topbar__field">
          <span className="topbar__label">{t.language}</span>
          <div className="topbar__lang" role="group" aria-label={t.language}>
            <button
              type="button"
              className={`topbar__lang-btn${language === 'hr' ? ' topbar__lang-btn--active' : ''}`}
              onClick={() => setLanguage('hr')}
            >
              HR
            </button>
            <button
              type="button"
              className={`topbar__lang-btn${language === 'en' ? ' topbar__lang-btn--active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
          </div>
        </label>
      </div>
    </header>
  );
}
