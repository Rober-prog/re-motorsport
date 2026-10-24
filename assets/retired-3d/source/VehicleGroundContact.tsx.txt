import { useEffect, useMemo } from 'react';
import { DataTexture, LinearFilter, RGBAFormat, UnsignedByteType } from 'three';
import type { ModelInfo } from './VehicleHotspots';

/** Low-cost occlusion at the physical tyre contacts, including the light quality tier. */
export function VehicleGroundContact({ info }: { info: ModelInfo }) {
  const texture = useMemo(() => {
    const size = 64,
      data = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) {
        const radius = Math.hypot((x / (size - 1) - 0.5) * 2, (y / (size - 1) - 0.5) * 2);
        data[(y * size + x) * 4 + 3] = Math.round(Math.max(0, 1 - radius) ** 2 * 255);
      }
    const map = new DataTexture(data, size, size, RGBAFormat, UnsignedByteType);
    map.minFilter = map.magFilter = LinearFilter;
    map.needsUpdate = true;
    return map;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  const contacts = useMemo(
    () =>
      ['WHL_FL_Tire.001', 'WHL_FR_Tire', 'WHL_RL_Tire', 'WHL_RR_Tire.001'].flatMap((name) => {
        const center = info.centers.get(name);
        return center ? [center.clone().add(info.translation).multiplyScalar(info.scale)] : [];
      }),
    [info],
  );
  return (
    <group>
      <mesh
        onUpdate={(mesh) => mesh.layers.set(1)}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.002, 0]}
        renderOrder={-2}
      >
        <planeGeometry args={[6.2, 3.3]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0.45}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      {contacts.map((point, index) => (
        <mesh
          key={index}
          onUpdate={(mesh) => mesh.layers.set(1)}
          position={[point.x, 0.004, point.z]}
          rotation={[-Math.PI / 2, 0, 0]}
          renderOrder={-1}
        >
          <planeGeometry args={[0.95, 0.8]} />
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={0.78}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
