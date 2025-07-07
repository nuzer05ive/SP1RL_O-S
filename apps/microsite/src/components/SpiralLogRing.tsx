import { useLap } from '../hooks/useSpiralState';

export default function SpiralLogRing() {
  const lap = useLap();
  const d = `M0 0 L${lap * 2} ${lap}`;
  return (
    <svg width="100" height="100" className="spiral-log-ring">
      <path d={d} stroke="white" fill="none" />
    </svg>
  );
}
