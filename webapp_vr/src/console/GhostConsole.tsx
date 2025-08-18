import React from 'react';
import { useGhostConsole } from './state';
import { dispatch } from './commands';

export default function GhostConsole() {
  const state = useGhostConsole();
  const fire = () => dispatch({ cmd: 'fire' });
  return (
    <div style={{ position: 'absolute', top: 0, right: 0, padding: 10, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '12px' }}>
      <div style={{ marginBottom: 8 }}>
        TEAL: {state.teal.score.toFixed(2)} | ZCM: {state.zcm.care.toFixed(2)}/{state.zcm.courage.toFixed(2)}/{state.zcm.trust.toFixed(2)} |
        Witness: {state.witness.arm}
      </div>
      <button onClick={fire}>fire !</button>
    </div>
  );
}
