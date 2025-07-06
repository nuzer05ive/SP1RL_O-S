import React from 'react';

export default function SpiralHUDTooltip({ node, lap, delta, wobble }) {
  return (
    <div className="spiral-hud-tooltip">
      Lap {lap} • Node {node} • Δt = {delta.toFixed(3)}s • w = {wobble.toFixed(3)}s
      <div className="hud-explainer">
        In SP1RL_O-S, the 'O-' is the living node lens and monocle HUD. Pi1LOTs
        use it to see every episode, node, and story through every possible
        lens. The 89th ('O-') is the True Justice perspective — seeing all nodes
        at once, making you a Minting Pi1LOT.
      </div>
    </div>
  );
}
