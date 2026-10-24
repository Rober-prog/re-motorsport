import { Pause, RotateCcw, RotateCw, SlidersHorizontal, RefreshCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '../ui/Primitives';
import { useVehicleInteraction } from './VehicleInteractionProvider';
export function VehicleControls({
  quality,
  onQuality,
  onPause,
}: {
  quality: 'low' | 'high';
  onQuality: (value: 'low' | 'high') => void;
  onPause: () => void;
}) {
  const { t } = useTranslation();
  const { reset, setRotation, rotation } = useVehicleInteraction();
  return (
    <div className="vehicle-controls">
      <Tooltip text={t('hero.rotateLeft')}>
        <button
          className="icon-button"
          aria-label={t('hero.rotateLeft')}
          onClick={() => setRotation(rotation - Math.PI / 6)}
        >
          <RotateCcw size={16} />
        </button>
      </Tooltip>
      <Tooltip text={t('hero.rotateRight')}>
        <button
          className="icon-button"
          aria-label={t('hero.rotateRight')}
          onClick={() => setRotation(rotation + Math.PI / 6)}
        >
          <RotateCw size={16} />
        </button>
      </Tooltip>
      <Tooltip text={t('common.reset')}>
        <button className="icon-button" aria-label={t('common.reset')} onClick={reset}>
          <RefreshCcw size={16} />
        </button>
      </Tooltip>
      <label className="quality-control">
        <SlidersHorizontal size={12} />
        <span className="sr-only">{t('common.quality')}</span>
        <select value={quality} onChange={(e) => onQuality(e.target.value as 'low' | 'high')}>
          <option value="low">{t('common.low')}</option>
          <option value="high">{t('common.high')}</option>
        </select>
      </label>
      <Tooltip text={t('hero.pause')}>
        <button className="icon-button" aria-label={t('hero.pause')} onClick={onPause}>
          <Pause size={15} />
        </button>
      </Tooltip>
    </div>
  );
}
