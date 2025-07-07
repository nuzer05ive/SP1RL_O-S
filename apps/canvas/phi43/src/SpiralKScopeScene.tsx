import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import starVert from './shaders/star.vert?raw';
import starFrag from './shaders/star.frag?raw';

export default function SpiralKScopeScene() {
  const mesh = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (mesh.current) mesh.current.rotation.z = clock.elapsedTime * 0.2;
  });

  return (
    <group>
      <mesh ref={mesh}>
        <torusGeometry args={[1, 0.2, 16, 100]} />
        <shaderMaterial
          vertexShader={starVert}
          fragmentShader={starFrag}
          uniforms={{ uNode: { value: 0 }, uC: { value: 0 }, uPhi: { value: 0 } }}
        />
      </mesh>
    </group>
  );
}
