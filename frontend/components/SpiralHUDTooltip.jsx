import React from 'react';

export default function SpiralHUDTooltip({ node, lap, delta, wobble }) {
  return (
    <div className="spiral-hud-tooltip">
      Lap {lap} • Node {node} • Δt = {delta.toFixed(3)}s • w = {wobble.toFixed(3)}s
    </div>
  );
}
