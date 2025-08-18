import React from 'react';
import { DTH } from '../engine/SpiralAddress';

type Props = { onFire: () => void; step: number };

export default function HUD({ onFire, step }: Props){
  return (
    <div className="hud">
      <button onClick={onFire}>fire !</button>
      <span> step: {step} &times; {DTH.toFixed(6)} rad</span>
    </div>
  );
}
