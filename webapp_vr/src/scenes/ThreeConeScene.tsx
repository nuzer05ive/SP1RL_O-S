import React from 'react';

export default function ThreeConeScene(){
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
        <meshBasicMaterial color="teal" />
      </mesh>
    </>
  );
}
