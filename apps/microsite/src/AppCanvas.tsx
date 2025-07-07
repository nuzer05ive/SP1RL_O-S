import { Canvas } from '@react-three/fiber';
import NodeRing from './components/NodeRing';
import PetalRing from './components/PetalRing';
import SpiralLogRing from './components/SpiralLogRing';
import KaleidoField from './components/KaleidoField';

export default function AppCanvas() {
  return (
    <Canvas>
      <KaleidoField />
      <NodeRing />
      <PetalRing />
      <SpiralLogRing />
    </Canvas>
  );
}
