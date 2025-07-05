import React from 'react';
import { Logo } from '../assets';

export default function SpiralClock({ timestamp }) {
  if (!timestamp)
    return <div className="spiral-clock">--:--</div>;
  const { clock_str, node, lap, mu, t_seconds, episode } = timestamp;
  return (
    <div className="spiral-clock">
      <img src={Logo} alt="logo" width={24} height={24} />
      <span>{clock_str}</span>
      <div className="hud">
        node {node} • lap {lap} • μ {mu.toFixed(3)} • Δt{' '}
        {t_seconds.toFixed(3)} • ep {episode}
      </div>
    </div>
  );
}
