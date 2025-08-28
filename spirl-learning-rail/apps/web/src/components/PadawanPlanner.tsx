import React, { useState } from 'react';
import { stp } from '../../../packages/core/src/stp';

export function PadawanPlanner() {
  const [mismatch, setMismatch] = useState(0);
  const value = stp(mismatch, 0, 0, 0);
  return (
    <div>
      <label>Mismatch
        <input type="range" min="0" max="10" value={mismatch}
          onChange={e => setMismatch(Number(e.target.value))} />
      </label>
      <div>STP: {value.toFixed(2)}</div>
    </div>
  );
}
