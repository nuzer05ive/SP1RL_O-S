import React from 'react';

// Minimal HUD overlay showing spiral time info
export default function SpiralHUDClient({ state, onToggle }) {
  if (!state) return null;
  const { clock, node, lap, μ, τ_multiple } = state;
  return (
    <div className="spiral-hud" onClick={onToggle}>
      <div className="clock">{clock}</div>
      <div className="meta">
        node {node} · lap {lap} · μ {μ.toFixed(3)} · nτ {τ_multiple}
      </div>
    </div>
  );
}
