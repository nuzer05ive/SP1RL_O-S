import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import fragment from '../shaders/kaleido.frag?raw';

export default function KaleidoField() {
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.z = clock.elapsedTime * 0.1;
    }
  });
  return (
    <mesh ref={mesh} position={[0,0,-1]}>
      <planeGeometry args={[10,10]} />
      <shaderMaterial fragmentShader={fragment} />
    </mesh>
  );
}
