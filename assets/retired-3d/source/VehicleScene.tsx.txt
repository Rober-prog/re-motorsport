import { Suspense, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei/core/ContactShadows';
import { AdaptiveDpr } from '@react-three/drei/core/AdaptiveDpr';
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three';
import { useTranslation } from 'react-i18next';
import { VehicleModel } from './VehicleModel';
import { VehicleLighting } from './VehicleLighting';
import { useVehicleInteraction } from './VehicleInteractionProvider';
function Visibility() {
  const { gl, invalidate } = useThree();
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') invalidate();
    };
    document.addEventListener('visibilitychange', onVisible);
    const onLost = (e: Event) => {
      e.preventDefault();
    };
    gl.domElement.addEventListener('webglcontextlost', onLost);
    gl.domElement.addEventListener('webglcontextrestored', onVisible);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      gl.domElement.removeEventListener('webglcontextlost', onLost);
      gl.domElement.removeEventListener('webglcontextrestored', onVisible);
    };
  }, [gl, invalidate]);
  return null;
}
export default function VehicleScene({
  quality,
  onReady,
}: {
  quality: 'low' | 'high';
  onReady: () => void;
}) {
  const { t } = useTranslation();
  const { rotation, setRotation } = useVehicleInteraction();
  const [start, setStart] = useState<{ x: number; rotation: number } | null>(null);
  return (
    <div
      className="vehicle-canvas"
      onPointerDown={(e) => {
        if (
          e.pointerType === 'touch' ||
          e.button !== 0 ||
          (e.target as HTMLElement).closest('button')
        )
          return;
        e.currentTarget.setPointerCapture(e.pointerId);
        setStart({ x: e.clientX, rotation });
      }}
      onPointerMove={(e) => {
        if (start && e.buttons === 1) setRotation(start.rotation + (e.clientX - start.x) * 0.006);
      }}
      onPointerUp={(e) => {
        setStart(null);
        if (e.currentTarget.hasPointerCapture(e.pointerId))
          e.currentTarget.releasePointerCapture(e.pointerId);
      }}
      onPointerCancel={() => setStart(null)}
      onLostPointerCapture={() => setStart(null)}
    >
      <Canvas
        frameloop="demand"
        dpr={[1, quality === 'low' ? 1 : 1.5]}
        camera={{ fov: 34, near: 0.05, far: 80, position: [-6, 3, 9] }}
        gl={{
          antialias: quality === 'high',
          alpha: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: import.meta.env.DEV,
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.1;
          gl.outputColorSpace = SRGBColorSpace;
        }}
        aria-label={t('hero.model')}
      >
        <Suspense fallback={null}>
          <VehicleLighting quality={quality} />
          <VehicleModel onReady={onReady} />
          <ContactShadows
            position={[0, 0, 0]}
            scale={9}
            blur={quality === 'high' ? 1.4 : 1.8}
            opacity={0.65}
            far={1.8}
            resolution={quality === 'high' ? 512 : 256}
            frames={Infinity}
          />
          <AdaptiveDpr pixelated />
          <Visibility />
        </Suspense>
      </Canvas>
    </div>
  );
}
