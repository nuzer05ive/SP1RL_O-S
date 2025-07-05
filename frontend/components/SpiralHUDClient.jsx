import React from 'react';
import { HUDRing, HUDTick } from '../assets';

// Minimal HUD overlay showing spiral time info
export default function SpiralHUDClient({ state, onToggle }) {
  if (!state) return null;
  const { clock, node, lap, μ, τ_multiple } = state;
  return (
    <div className="spiral-hud" onClick={onToggle}>
      <img src={HUDRing} alt="ring" className="ring" />
      <img src={HUDTick} alt="tick" className="tick" />
      <div className="clock">{clock}</div>
      <div className="meta">
        node {node} · lap {lap} · μ {μ.toFixed(3)} · nτ {τ_multiple}
      </div>
    </div>
  );
}
