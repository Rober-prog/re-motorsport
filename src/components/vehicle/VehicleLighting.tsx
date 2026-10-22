import { Environment } from '@react-three/drei/core/Environment';
import { Lightformer } from '@react-three/drei/core/Lightformer';
export function VehicleLighting({ quality }: { quality: 'low' | 'high' }) {
  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[-3, 6, 4]} intensity={2.8} color="#e4ecf3" />
      <directionalLight position={[3, 3, -4]} intensity={2} color="#9fc3e1" />
      <directionalLight position={[1, 3, 5]} intensity={2.1} color="#ffffff" />
      <Environment resolution={quality === 'low' ? 128 : 256} frames={1}>
        <Lightformer
          form="rect"
          intensity={3}
          color="#ffffff"
          scale={[8, 2, 1]}
          position={[0, 5, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={3}
          color="#dee8f2"
          scale={[12, 5, 1]}
          position={[-1, 3, 5]}
          rotation={[0, 0, -0.25]}
        />
        <Lightformer
          form="rect"
          intensity={2.2}
          color="#e0e8f0"
          scale={[10, 4, 1]}
          position={[0, 3, -6]}
          rotation={[0, Math.PI, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.5}
          color="#60bed2"
          scale={[8, 2, 1]}
          position={[3, 2, -5]}
          rotation={[0, Math.PI, 0]}
        />
        <Lightformer
          form="rect"
          intensity={2}
          color="#ffffff"
          scale={[1, 5, 1]}
          position={[-5, 2, 0]}
          rotation={[0, Math.PI / 2, 0]}
        />
      </Environment>
    </>
  );
}
