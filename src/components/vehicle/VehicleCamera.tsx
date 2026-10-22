import { useLayoutEffect, useRef, type RefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Box3, Group, MathUtils, PerspectiveCamera, Vector3 } from 'three';
/** Solve the perspective inequalities for all eight corners. No guessed zoom distance. */
export function fitCamera(box: Box3, aspect: number, fov = 34, occupancy = 0.82) {
  // The garage plate was shot almost level, at headlight height.
  const direction = new Vector3(-0.66, 0.025, 1).normalize();
  const right = new Vector3().crossVectors(new Vector3(0, 1, 0), direction).normalize();
  const up = new Vector3().crossVectors(direction, right).normalize();
  const target = box.getCenter(new Vector3());
  target.y = box.min.y + box.getSize(new Vector3()).y * 0.42;
  const tan = Math.tan(MathUtils.degToRad(fov / 2));
  let distance = 0;
  for (const x of [box.min.x, box.max.x])
    for (const y of [box.min.y, box.max.y])
      for (const z of [box.min.z, box.max.z]) {
        const corner = new Vector3(x, y, z).sub(target);
        const depth = corner.dot(direction);
        distance = Math.max(
          distance,
          depth + Math.abs(corner.dot(right)) / (tan * aspect * occupancy),
          depth + Math.abs(corner.dot(up)) / (tan * occupancy),
        );
      }
  return { position: direction.multiplyScalar(distance).add(target), target, distance };
}
/** Preserve the initial framing, pulling back only when a rotated corner needs room. */
export function fitOrbitCamera(box: Box3, aspect: number, horizonFraction: number, yaw: number) {
  const base = fitCamera(box, aspect, 34, 0.88);
  const direction = base.position.clone().sub(base.target).normalize();
  const right = new Vector3().crossVectors(new Vector3(0, 1, 0), direction).normalize();
  const up = new Vector3().crossVectors(direction, right).normalize();
  const tan = Math.tan(MathUtils.degToRad(17));
  const shiftX = 0.07;
  const shiftY = 1 - 2 * horizonFraction - Math.tan(Math.asin(direction.y)) / tan;
  let distance = base.distance;
  const axis = new Vector3(0, 1, 0);
  for (const x of [box.min.x, box.max.x])
    for (const y of [box.min.y, box.max.y])
      for (const z of [box.min.z, box.max.z]) {
        const corner = new Vector3(x, y, z).applyAxisAngle(axis, yaw).sub(base.target);
        const depth = corner.dot(direction),
          horizontal = corner.dot(right),
          vertical = corner.dot(up);
        distance = Math.max(
          distance,
          depth +
            Math.abs(horizontal) /
              (tan * aspect * Math.max(0.1, 0.96 - Math.sign(horizontal) * shiftX)),
          depth + Math.abs(vertical) / (tan * Math.max(0.1, 0.96 - Math.sign(vertical) * shiftY)),
        );
      }
  return {
    position: direction.multiplyScalar(distance).add(base.target),
    target: base.target,
    distance,
  };
}
/** Align the 3D ground's vanishing line with the level background photograph. */
export function alignVehicleHorizon(
  camera: PerspectiveCamera,
  width: number,
  height: number,
  horizon: number,
) {
  const direction = camera.getWorldDirection(new Vector3());
  const pitch = Math.asin(-direction.y);
  const cameraHorizon =
    height * (0.5 - Math.tan(pitch) / (2 * Math.tan(MathUtils.degToRad(camera.fov / 2))));
  camera.setViewOffset(width, height, -width * 0.035, cameraHorizon - horizon, width, height);
}
export function VehicleCamera({ bounds, root }: { bounds: Box3; root: RefObject<Group | null> }) {
  const { camera, size, gl, invalidate } = useThree();
  const calibration = useRef<{
    width: number;
    height: number;
    horizon: number;
    yaw: number;
  } | null>(null);
  useLayoutEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) return;
    camera.fov = 34;
    camera.layers.enable(1);
    camera.clearViewOffset();
    let horizon = size.height / 2;
    const hero = gl.domElement.closest('.hero');
    if (hero) {
      const plate = hero.getBoundingClientRect();
      const canvas = gl.domElement.getBoundingClientRect();
      // CSS cover keeps the level photograph's horizon at its vertical centre.
      // Match that line in hero coordinates, independently of the canvas crop.
      horizon = plate.top + plate.height / 2 - canvas.top;
    }
    const yaw = (root.current?.rotation.y || 0) + (root.current?.parent?.rotation.y || 0);
    const fit = fitOrbitCamera(bounds, size.width / size.height, horizon / size.height, yaw);
    camera.position.copy(fit.position);
    camera.lookAt(fit.target);
    alignVehicleHorizon(camera, size.width, size.height, horizon);
    calibration.current = { width: size.width, height: size.height, horizon, yaw };
    camera.near = 0.05;
    camera.far = Math.max(80, fit.distance * 5);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size.width, size.height, gl, bounds, root, invalidate]);
  useFrame(() => {
    const frame = calibration.current;
    if (!frame || !root.current || !(camera instanceof PerspectiveCamera)) return;
    const yaw = root.current.rotation.y + (root.current.parent?.rotation.y || 0);
    if (Math.abs(yaw - frame.yaw) < 0.00001) return;
    const fit = fitOrbitCamera(
      bounds,
      frame.width / frame.height,
      frame.horizon / frame.height,
      yaw,
    );
    camera.position.copy(fit.position);
    camera.lookAt(fit.target);
    alignVehicleHorizon(camera, frame.width, frame.height, frame.horizon);
    frame.yaw = yaw;
  });
  return null;
}
