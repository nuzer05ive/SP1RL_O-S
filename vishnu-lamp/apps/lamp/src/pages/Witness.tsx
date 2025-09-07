import React, { useEffect, useState } from 'react';
import { beattyFront, beattyBack, phiWindow, thetaPrime } from '@vishnu/core';
import { commit } from '../lib/api';

export function simulateDrift(ticks: number): number {
  const step = thetaPrime(1, 1) * 60;
  let drift = 1;
  for (let i = 0; i < ticks; i++) {
    drift = Math.max(0, drift - step);
  }
  return drift;
}

export function beattyOverlay(k: number) {
  return { front: beattyFront(k), back: beattyBack(k) };
}

export default function Witness() {
  const [ticks, setTicks] = useState(0);
  const [drift, setDrift] = useState(1);
  const { front, back } = beattyOverlay(9);
  const phiHits = front.filter((n) => phiWindow(n, 0, 0.1));

  const handleCommit = async () => {
    const patch = { witness: ticks + 1 };
    const prev = ticks;
    setTicks(prev + 1);
    try {
      await commit('default', patch);
    } catch {
      setTicks(prev);
      console.error('commit failed');
    }
  };

  useEffect(() => {
    const id = setInterval(() => {
      setDrift(simulateDrift(ticks));
    }, 100);
    return () => clearInterval(id);
  }, [ticks]);

  return (
    <div>
      <h1>Witness Ring</h1>
      <div data-testid="ring">
        {front.slice(0, 8).map((n, i) => (
          <span key={i} className={phiHits.includes(n) ? 'hit' : 'node'}>
            N{i + 1}
          </span>
        ))}
        <span className="closure">W9:{front[8]}</span>
      </div>
      <div data-testid="drift">{drift.toFixed(3)}</div>
      <div data-testid="beatty">
        {front.slice(0, 8).map((v, i) => (
          <span key={`f${i}`}>{v}</span>
        ))}
        {back.slice(0, 8).map((v, i) => (
          <span key={`b${i}`}>{v}</span>
        ))}
      </div>
      <button onClick={handleCommit}>Commit Fold</button>
    </div>
  );
}
