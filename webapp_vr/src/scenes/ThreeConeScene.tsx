import React from 'react';
import { useFrame } from '@react-three/fiber';
import { useGhost } from '../routes/VRPortal';

export default function ThreeConeScene(){
  const { state, fire } = useGhost();
  useFrame(()=> fire());
  const ringColor = state.lockHard ? 'teal' : (state.teal>=0.62?'#1abc9c':'#555');
  return (
    <>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0,0]}>
        <coneGeometry args={[1,2,32]} />
        <meshStandardMaterial color="blue" wireframe />
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[2,0,0]}>
        <coneGeometry args={[1,2,32]} />
        <meshStandardMaterial color="yellowgreen" wireframe />
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[-2,0,0]}>
        <coneGeometry args={[1,2,32]} />
        <meshStandardMaterial color="orangered" wireframe />
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]}>
        <ringGeometry args={[1.1,1.2,32]} />
        <meshBasicMaterial color={ringColor} />
      </mesh>
    </>
  );
}
