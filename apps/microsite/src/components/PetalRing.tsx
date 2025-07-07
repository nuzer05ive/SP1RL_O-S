import { phaseToColour } from '@sp1rl/core-math';
import { useNode, usePetal } from '../hooks/useSpiralState';
import { kaleidoFrame } from '../math/n1k';

export default function PetalRing() {
  const node = useNode();
  const petal = usePetal();
  const [hue, offset] = kaleidoFrame(node);
  const style = {
    transform: `scale(${1 + offset * 0.01})`,
    color: `hsl(${hue},100%,50%)`
  } as React.CSSProperties;
  return (
    <div className="petal-ring" style={style}>
      {phaseToColour(petal)}
    </div>
  );
}
