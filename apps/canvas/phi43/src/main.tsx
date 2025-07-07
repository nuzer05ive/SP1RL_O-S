import React from 'react';
import ReactDOM from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import SpiralKScopeScene from './SpiralKScopeScene';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Canvas>
      <SpiralKScopeScene />
    </Canvas>
  </React.StrictMode>
);
