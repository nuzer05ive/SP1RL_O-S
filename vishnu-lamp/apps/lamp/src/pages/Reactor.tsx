import { useState } from 'react';
import type { Chem, ReactorState } from '@vishnu/core/reactorMath';
import { commit } from '../lib/api';

export default function Reactor() {
  const [phiS, setPhiS] = useState(0);
  const [phiK, setPhiK] = useState(0);
  const [chem, setChem] = useState<Chem>({ S: 0.5, D: 0.5, C: 0.5 });
  const [feats, setFeats] = useState({ compRatio: 0, mi: 0, windowHitDensity: 0 });
  const [state, setState] = useState<ReactorState | null>(null);

  async function step() {
    const res = await fetch('/api/reactor/step', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phiS, phiK, R: state?.R ?? 0, chem, feats }),
    });
    const data = (await res.json()) as { state: ReactorState; patch: any };
    setPhiS(data.state.phiS);
    setPhiK(data.state.phiK);
    setState(data.state);
    await commit('default', data.patch, {
      body: JSON.stringify({
        scene_id: 'default',
        patch: data.patch,
        telemetry: { reactor: data.state },
      }),
    });
  }

  return (
    <div>
      <h1>
        Reactor <a href="/docs/reactor.md" target="_blank" rel="noreferrer">?</a>
      </h1>
      <div>
        <label>
          φ_S
          <input
            type="range"
            min="0"
            max={Math.PI * 2}
            step="0.01"
            value={phiS}
            onChange={(e) => setPhiS(parseFloat(e.target.value))}
          />
        </label>
        <label>
          φ_K
          <input
            type="range"
            min="0"
            max={Math.PI * 2}
            step="0.01"
            value={phiK}
            onChange={(e) => setPhiK(parseFloat(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          S
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={chem.S}
            onChange={(e) => setChem({ ...chem, S: parseFloat(e.target.value) })}
          />
        </label>
        <label>
          D
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={chem.D}
            onChange={(e) => setChem({ ...chem, D: parseFloat(e.target.value) })}
          />
        </label>
        <label>
          C
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={chem.C}
            onChange={(e) => setChem({ ...chem, C: parseFloat(e.target.value) })}
          />
        </label>
      </div>
      <div>
        <label>
          compRatio
          <input
            type="number"
            value={feats.compRatio}
            onChange={(e) =>
              setFeats({ ...feats, compRatio: parseFloat(e.target.value) })
            }
          />
        </label>
        <label>
          MI
          <input
            type="number"
            value={feats.mi}
            onChange={(e) => setFeats({ ...feats, mi: parseFloat(e.target.value) })}
          />
        </label>
        <label>
          windowHitDensity
          <input
            type="number"
            value={feats.windowHitDensity}
            onChange={(e) =>
              setFeats({ ...feats, windowHitDensity: parseFloat(e.target.value) })
            }
          />
        </label>
      </div>
      <button onClick={step}>Step Reactor</button>
      {state && (
        <div>
          <div
            style={{
              width: `${Math.abs(state.thrust) * 100}%`,
              background: 'orange',
              height: '10px',
              marginTop: '10px',
            }}
            title="thrust"
          />
          <p>Δ: {state.delta.toFixed(3)}</p>
          <p>thrust: {state.thrust.toFixed(3)}</p>
          <p>coat: [{state.coat.map((v) => v.toFixed(2)).join(', ')}]</p>
          <p>
            τ: {state.tauBandit.toFixed(3)} κ: {state.kappaPLL.toFixed(3)}
          </p>
          <p>R: {state.R.toFixed(3)} H: {state.H.toFixed(3)}</p>
          <p>Y-fork: {state.yFork ? 'yes' : 'no'}</p>
        </div>
      )}
    </div>
  );
}
