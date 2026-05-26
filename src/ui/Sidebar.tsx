import { useLanguage } from '../i18n/LanguageContext';
import { EXERCISES_BY_MODE, type Mode } from '../i18n/translations';

type Props = { mode: Mode };

export function Sidebar({ mode }: Props) {
  const { t } = useLanguage();
  const exercises = EXERCISES_BY_MODE[mode];

  return (
    <aside className="sidebar">
      <h2 className="sidebar__title">{t.exercises}</h2>
      <ul className="sidebar__list">
        {exercises.map((id) => (
          <li key={id} className="sidebar__item">
            {t.exerciseNames[id]}
          </li>
        ))}
      </ul>
    </aside>
  );
}
