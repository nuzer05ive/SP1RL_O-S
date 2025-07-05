import React from 'react';

export default function SpiralClock({ timestamp }) {
  if (!timestamp) return <div className="spiral-clock">--:--</div>;
  return (
    <div className="spiral-clock">
      <span>{timestamp.clock_str}</span>
    </div>
  );
}
