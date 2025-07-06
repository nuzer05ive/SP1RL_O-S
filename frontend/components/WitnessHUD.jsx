import React from 'react';

export default function WitnessHUD({ state, onToggle }) {
  if (!state) return null;
  const { clock, τ_multiple } = state;
  return (
    <div className="witness-hud" onClick={onToggle}>
      <span className="clock">{clock}</span>
      <span className="tau">τ×{τ_multiple.toFixed(3)}</span>
    </div>
  );
}
