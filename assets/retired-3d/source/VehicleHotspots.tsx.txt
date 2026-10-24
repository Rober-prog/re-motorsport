import { useMemo, useRef } from 'react';
import { Html } from '@react-three/drei/web/Html';
import { useFrame, useThree } from '@react-three/fiber';
import { Box3, Object3D, Raycaster, Vector3 } from 'three';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { activeCategories, type Locale } from '../../data/categories';
import {
  vehicleHotspots,
  type VehicleHotspotConfig,
  type VectorTuple,
} from '../../data/vehicleHotspots';
import { localeFromPath } from '../../lib/routing';
import { useVehicleInteraction } from './VehicleInteractionProvider';
export interface ModelInfo {
  scene: Object3D;
  originalBounds: Box3;
  centeredBounds: Box3;
  scale: number;
  translation: Vector3;
  nodes: Map<string, Object3D>;
  centers: Map<string, Vector3>;
}
function resolveAnchor(point: VehicleHotspotConfig, info: ModelInfo): VectorTuple {
  const centerOfMesh = point.meshName ? info.centers.get(point.meshName) : null;
  const size = info.originalBounds.getSize(new Vector3());
  const center = info.originalBounds.getCenter(new Vector3());
  const position = centerOfMesh
    ? centerOfMesh.clone()
    : new Vector3(
        center.x + point.anchor[0] * size.x,
        info.originalBounds.min.y + point.anchor[1] * size.y,
        center.z + point.anchor[2] * size.z,
      );
  position
    .add(info.translation)
    .multiplyScalar(info.scale)
    .add(new Vector3(...point.offset));
  return position.toArray() as VectorTuple;
}
function VehicleHotspot({
  point,
  info,
  locale,
}: {
  point: VehicleHotspotConfig;
  info: ModelInfo;
  locale: Locale;
}) {
  const interaction = useVehicleInteraction();
  const ref = useRef<HTMLButtonElement>(null);
  const { size, camera } = useThree();
  const worldPosition = useMemo(() => new Vector3(), []);
  const direction = useMemo(() => new Vector3(), []);
  const position = useMemo(() => resolveAnchor(point, info), [point, info]);
  const category = activeCategories().find((c) => c.id === point.categoryId)!;
  const raycaster = useMemo(() => new Raycaster(), []);
  const lastCheck = useRef(-1);
  const lastYaw = useRef(NaN);
  useFrame(({ clock }) => {
    const yaw = info.scene.parent?.parent?.rotation.y || 0;
    const settled = Math.abs(yaw - interaction.rotation) < 0.001;
    const finalCheck =
      settled && (!Number.isFinite(lastYaw.current) || Math.abs(yaw - lastYaw.current) > 0.00001);
    if (!ref.current || (clock.elapsedTime - lastCheck.current < 0.15 && !finalCheck)) return;
    lastCheck.current = clock.elapsedTime;
    lastYaw.current = yaw;
    worldPosition.set(...position);
    info.scene.parent?.parent?.localToWorld(worldPosition);
    direction.copy(worldPosition).sub(camera.position);
    const distance = direction.length();
    raycaster.set(camera.position, direction.normalize());
    raycaster.far = distance - 0.22;
    const behind =
      point.occlude &&
      raycaster
        .intersectObject(info.scene, true)
        .some((hit) => hit.object !== info.nodes.get(point.meshName || ''));
    ref.current.classList.toggle('is-occluded', behind);
    ref.current.tabIndex = behind ? -1 : 0;
    ref.current.style.pointerEvents = behind ? 'none' : 'auto';
  });
  // The two close wheel anchors are deliberately assigned to different axles.
  if (size.width < 640 && ['interior'].includes(point.id)) return null;
  return (
    <Html position={position} center zIndexRange={[9, 1]} style={{ pointerEvents: 'none' }}>
      <button
        ref={ref}
        type="button"
        data-hotspot={point.id}
        data-anchor-mode={point.meshName && info.nodes.has(point.meshName) ? 'mesh' : 'schematic'}
        style={{
          pointerEvents: 'auto',
          transform: `translate(${point.visualOffset[0]}px, ${point.visualOffset[1]}px)`,
        }}
        className={`hotspot ${interaction.selected === point.id ? 'is-selected' : ''}`}
        aria-label={category.name[locale]}
        aria-expanded={interaction.selected === point.id}
        aria-controls={interaction.selected === point.id ? 'vehicle-popup' : undefined}
        onPointerUp={(event) => {
          if (event.pointerType === 'touch') interaction.select(point.id, event.currentTarget);
        }}
        onClick={(e) => interaction.select(point.id, e.currentTarget)}
      >
        <span className="hotspot-dot" />
        <span className="hotspot-label">{category.name[locale]}</span>
      </button>
    </Html>
  );
}
export function VehicleHotspots({ info }: { info: ModelInfo }) {
  const locale = localeFromPath(useLocation().pathname);
  const { t } = useTranslation();
  return (
    <group name={t('hero.label')}>
      {vehicleHotspots
        .filter(
          (p) =>
            p.active && p.showOnVehicle && activeCategories().some((c) => c.id === p.categoryId),
        )
        .map((point) => (
          <VehicleHotspot key={point.id} point={point} info={info} locale={locale} />
        ))}
    </group>
  );
}
