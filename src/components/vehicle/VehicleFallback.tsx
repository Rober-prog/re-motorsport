import { useTranslation } from 'react-i18next';
import { useLayoutEffect, useRef } from 'react';
import { ActionLink } from '../ui/Primitives';
import poster from '../../data/vehiclePoster.json';
import { assetPath } from '../../lib/basePath';
export function VehicleFallback({
  reason,
  onActivate,
}: {
  reason?: 'noWebgl' | 'modelError';
  onActivate?: () => void;
}) {
  const { t } = useTranslation();
  const image = useRef<HTMLImageElement>(null);
  useLayoutEffect(() => {
    const element = image.current;
    const stage = element?.parentElement;
    const hero = element?.closest('.hero');
    if (!element || !stage || !hero) return;
    const align = () => {
      const bounds = stage.getBoundingClientRect();
      const plate = hero.getBoundingClientRect();
      const scale = Math.min(bounds.width / poster.width, bounds.height / poster.height);
      element.style.width = `${poster.width * scale}px`;
      element.style.height = `${poster.height * scale}px`;
      element.style.left = `${(bounds.width - poster.width * scale) / 2}px`;
      element.style.top = `${plate.top + plate.height / 2 - bounds.top - poster.horizon * scale}px`;
    };
    const observer = new ResizeObserver(align);
    observer.observe(stage);
    observer.observe(hero);
    align();
    return () => observer.disconnect();
  }, []);
  return (
    <div className="vehicle-fallback">
      <img
        ref={image}
        className="vehicle-poster"
        src={assetPath('/images/vehicle-poster.webp')}
        alt={t('hero.model')}
        width={poster.width}
        height={poster.height}
        fetchPriority="high"
      />
      {(reason || onActivate) && (
        <div className="vehicle-fallback-copy">
          <p>{t(reason ? `common.${reason}` : 'hero.fallbackText')}</p>
          {onActivate ? (
            <button className="button button-secondary" onClick={onActivate}>
              {t('common.view3d')}
            </button>
          ) : (
            <ActionLink to="/catalogo" secondary>
              {t('common.viewCatalog')}
            </ActionLink>
          )}
        </div>
      )}
    </div>
  );
}
