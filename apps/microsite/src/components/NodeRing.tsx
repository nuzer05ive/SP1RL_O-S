import { useNode } from '../hooks/useSpiralState';

export default function NodeRing() {
  const node = useNode();
  return (
    <div className="node-ring">
      Node {node}
    </div>
  );
}
