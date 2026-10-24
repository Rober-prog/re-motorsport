import { useProgress } from '@react-three/drei/core/Progress';
import { useTranslation } from 'react-i18next';
export function VehicleLoader() {
  const { progress, active } = useProgress();
  const { t } = useTranslation();
  if (!active) return null;
  return (
    <div className="vehicle-loading" role="status" aria-live="polite">
      <span className="vehicle-loader-count">
        {Math.round(progress)}
        <small>%</small>
      </span>
      <span className="loading-track" />
      {t('hero.loading')}
    </div>
  );
}
