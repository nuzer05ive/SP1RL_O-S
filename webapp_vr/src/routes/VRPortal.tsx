import React from 'react';
import { Canvas } from '@react-three/fiber';
import ThreeConeScene from '../scenes/ThreeConeScene';

interface Props { goHome: () => void; }

export default function VRPortal({ goHome }: Props) {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <button style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }} onClick={goHome}>
        Home
      </button>
      <Canvas>
        <ambientLight />
        <ThreeConeScene />
      </Canvas>
    </div>
  );
}
