import { useLanguage } from '../i18n/LanguageContext';
import type { Mode } from '../i18n/translations';
import { exerciseName, exercisesForMode, type Feasibility } from '../exercises/exercises';

type Props = {
  mode: Mode;
  selectedExerciseId: string | null;
  onSelectExercise: (id: string) => void;
};

const FEASIBILITY_CLASS: Record<Feasibility, string> = {
  DA: 'sidebar__chip--da',
  DJELOMICNO: 'sidebar__chip--djelomicno',
  NE: 'sidebar__chip--ne',
};

export function Sidebar({ mode, selectedExerciseId, onSelectExercise }: Props) {
  const { t, language } = useLanguage();
  const exercises = exercisesForMode(mode);

  return (
    <aside className="sidebar">
      <h2 className="sidebar__title">{t.exercises}</h2>
      <ul className="sidebar__list">
        {exercises.map((ex) => {
          const selected = ex.id === selectedExerciseId;
          return (
            <li key={ex.id}>
              <button
                type="button"
                className={`sidebar__item${selected ? ' sidebar__item--selected' : ''}`}
                onClick={() => onSelectExercise(ex.id)}
              >
                <span className="sidebar__item-name">{exerciseName(ex, language)}</span>
                <span className={`sidebar__chip ${FEASIBILITY_CLASS[ex.feasibility]}`}>
                  {t.feasibility[ex.feasibility]}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
