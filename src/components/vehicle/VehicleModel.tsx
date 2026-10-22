import { useEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei/core/Gltf';
import { useThree } from '@react-three/fiber';
import { Box3, Group, Mesh, Vector3, MeshStandardMaterial } from 'three';
import gsap from 'gsap';
import { VehicleCamera } from './VehicleCamera';
import { VehicleHotspots, type ModelInfo } from './VehicleHotspots';
import { useVehicleInteraction } from './VehicleInteractionProvider';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { VehicleScreenBounds } from './VehicleScreenBounds';
import { VehicleGroundContact } from './VehicleGroundContact';
import { assetPath } from '../../lib/basePath';
export function VehicleModel({ onReady }: { onReady: () => void }) {
  const { scene: loaded } = useGLTF(
    assetPath('/models/lamborghini-temerario.web.glb'),
    false,
    true,
  );
  const scene = useMemo(() => loaded.clone(true), [loaded]);
  const root = useRef<Group>(null);
  const entry = useRef<Group>(null);
  const { invalidate } = useThree();
  const { rotation, selected } = useVehicleInteraction();
  const reduced = useReducedMotion();
  const info = useMemo<ModelInfo>(() => {
    scene.updateMatrixWorld(true);
    const originalBounds = new Box3().setFromObject(scene);
    const size = originalBounds.getSize(new Vector3());
    const center = originalBounds.getCenter(new Vector3());
    const scale = 6 / Math.max(size.x, size.z);
    const translation = new Vector3(-center.x, -originalBounds.min.y, -center.z);
    const centeredBounds = originalBounds.clone().translate(translation);
    centeredBounds.min.multiplyScalar(scale);
    centeredBounds.max.multiplyScalar(scale);
    const nodes = new Map<string, Mesh>();
    const centers = new Map<string, Vector3>();
    scene.traverse((object) => {
      if (object instanceof Mesh) {
        nodes.set(object.name, object);
        const meshCenter = new Box3().setFromObject(object).getCenter(new Vector3());
        centers.set(object.name, meshCenter);
        // GLTFLoader sanitizes punctuation. Keep its original glTF name as an alias.
        if (typeof object.userData.name === 'string') {
          nodes.set(object.userData.name, object);
          centers.set(object.userData.name, meshCenter);
        }
        object.castShadow = true;
        object.receiveShadow = true;
        if (
          !Array.isArray(object.material) &&
          object.material.name === 'car_metallic_paint_02.001' &&
          object.material instanceof MeshStandardMaterial
        ) {
          object.material = object.material.clone();
          object.material.color.set('#3d4854');
          object.material.metalness = 0.82;
          object.material.roughness = 0.22;
        }
      }
    });
    if (import.meta.env.DEV)
      console.info('[model] scene.traverse()', {
        meshes: new Set(nodes.values()).size,
        bounds: originalBounds,
        scale,
      });
    return { scene, originalBounds, centeredBounds, scale, translation, nodes, centers };
  }, [scene]);
  useEffect(() => {
    onReady();
    invalidate();
  }, [onReady, invalidate]);
  useEffect(() => {
    if (!entry.current || reduced) return;
    const timeline = gsap.timeline({ onUpdate: invalidate });
    timeline.fromTo(
      entry.current.rotation,
      { y: -0.04 },
      { y: 0, duration: 1.2, ease: 'power2.out' },
      0,
    );
    return () => {
      timeline.kill();
    };
  }, [reduced, invalidate]);
  useEffect(() => {
    if (!root.current) return;
    const tween = gsap.to(root.current.rotation, {
      y: rotation,
      duration: reduced ? 0 : 0.45,
      ease: 'power2.out',
      onUpdate: invalidate,
    });
    return () => {
      tween.kill();
    };
  }, [rotation, reduced, invalidate]);
  useEffect(() => {
    const node = selected
      ? (info.nodes.get(
          (
            {
              'ruedas-neumaticos': 'WHL_FL_Tire.001',
              frenos: 'WHL_RL_BrakeDisc',
              iluminacion: 'LGT_F_DaylightLedON_02',
              'retrovisores-accesorios': 'DOOR_L_Mirror_02',
            } as Record<string, string>
          )[selected],
        ) as Mesh | undefined)
      : undefined;
    if (!node) return;
    const originals = Array.isArray(node.material) ? node.material : [node.material];
    const materials = originals.map((material) => material.clone());
    node.material = Array.isArray(node.material) ? materials : materials[0];
    for (const material of materials) {
      if (material instanceof MeshStandardMaterial) {
        material.emissive.set('#60bed2');
        material.emissiveIntensity = 0.22;
      }
    }
    invalidate();
    return () => {
      node.material = Array.isArray(node.material) ? originals : originals[0];
      materials.forEach((m) => m.dispose());
      invalidate();
    };
  }, [selected, info, invalidate]);
  return (
    <>
      <VehicleCamera bounds={info.centeredBounds} root={root} />
      <VehicleScreenBounds info={info} root={root} />
      <group ref={entry}>
        <group ref={root}>
          <VehicleGroundContact info={info} />
          <group scale={info.scale}>
            <primitive object={scene} position={info.translation} />
          </group>
          <VehicleHotspots info={info} />
        </group>
      </group>
    </>
  );
}
