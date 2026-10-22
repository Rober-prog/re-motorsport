import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { activeCategories } from '../../data/categories';
import { localeFromPath } from '../../lib/routing';
import { ErrorBoundary } from '../ui/Primitives';
import { VehicleInteractionProvider, useVehicleInteraction } from './VehicleInteractionProvider';
import { VehicleFallback } from './VehicleFallback';
import { VehiclePopup } from './VehiclePopup';
import { VehicleControls } from './VehicleControls';
const Scene = lazy(() => import('./VehicleScene'));
const VehicleLoader = lazy(() =>
  import('./VehicleLoader').then((module) => ({ default: module.VehicleLoader })),
);
function CategoryAlternative() {
  const { select } = useVehicleInteraction();
  const locale = localeFromPath(useLocation().pathname);
  const { t } = useTranslation();
  return (
    <div className="vehicle-category-access">
      <label className="sr-only" htmlFor="vehicle-category">
        {t('common.browse')}
      </label>
      <select
        id="vehicle-category"
        defaultValue=""
        onChange={(e) => {
          if (e.target.value) select(e.target.value, e.target);
          e.currentTarget.value = '';
        }}
      >
        <option value="">{t('common.browse')}</option>
        {activeCategories().map((c) => (
          <option key={c.id} value={c.id}>
            {c.name[locale]}
          </option>
        ))}
      </select>
    </div>
  );
}
export function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2');
    if (!context) return false;
    context.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}
export default function VehicleExperience() {
  const ref = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [quality, setQuality] = useState<'low' | 'high'>('low');
  const onReady = useCallback(() => setReady(true), []);
  useEffect(() => {
    const webgl = supportsWebGL();
    setAvailable(webgl);
    const lightweight = window.matchMedia('(pointer:coarse)').matches || window.innerWidth < 768;
    setQuality(lightweight ? 'low' : 'high');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    // A usable static first paint comes before the optional 10 MB 3D experience on mobile.
    if (!webgl || lightweight || connection?.saveData) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <VehicleInteractionProvider>
      <div
        ref={ref}
        className="vehicle-experience"
        data-vehicle-state={active ? 'active' : 'static'}
      >
        {(!ready || !active) && (
          <VehicleFallback
            reason={available === false ? 'noWebgl' : undefined}
            onActivate={available === true && !active ? () => setActive(true) : undefined}
          />
        )}
        {active && (
          <ErrorBoundary fallback={<VehicleFallback reason="modelError" />}>
            <Suspense fallback={null}>
              <Scene quality={quality} onReady={onReady} />
            </Suspense>
            <Suspense fallback={null}>
              <VehicleLoader />
            </Suspense>
            <VehicleControls
              quality={quality}
              onQuality={setQuality}
              onPause={() => setActive(false)}
            />
          </ErrorBoundary>
        )}
        <VehiclePopup />
        <CategoryAlternative />
      </div>
    </VehicleInteractionProvider>
  );
}
