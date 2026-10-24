import { useMemo, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import type { ModelInfo } from './VehicleHotspots';
import { useVehicleInteraction } from './VehicleInteractionProvider';
/** Project the inspected mesh centers, rather than treating the whole canvas as the car. */
export function VehicleScreenBounds({
  info,
  root,
}: {
  info: ModelInfo;
  root: RefObject<Group | null>;
}) {
  const { geometry } = useVehicleInteraction();
  const points = useMemo(
    () =>
      [...new Set(info.centers.values())].map((point) =>
        point.clone().add(info.translation).multiplyScalar(info.scale),
      ),
    [info],
  );
  const projected = useMemo(() => new Vector3(), []);
  useFrame(({ camera }) => {
    if (!root.current) return;
    root.current.updateWorldMatrix(true, false);
    let left = Infinity,
      top = Infinity,
      right = -Infinity,
      bottom = -Infinity;
    for (const point of points) {
      projected.copy(point).applyMatrix4(root.current.matrixWorld).project(camera);
      const x = (projected.x + 1) / 2,
        y = (1 - projected.y) / 2;
      left = Math.min(left, x);
      right = Math.max(right, x);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
    }
    geometry.current.car = { left, top, width: right - left, height: bottom - top };
  });
  return null;
}
