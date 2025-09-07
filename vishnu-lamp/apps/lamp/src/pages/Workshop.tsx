import { useState } from 'react';
import {
  buildFromFold,
  meshDigest,
  type BuilderKind,
  type NeutralMesh,
} from '@vishnu/core';

const kinds: BuilderKind[] = ['cycloid', 'mobius', 'petal_bloom', 'yellow_sack'];

export default function Workshop() {
  const [kind, setKind] = useState<BuilderKind>('cycloid');
  const [hinge, setHinge] = useState(1);
  const [slider, setSlider] = useState(0);
  const [meshes, setMeshes] = useState<NeutralMesh[] | null>(null);
  const [serverDigest, setServerDigest] = useState('');

  function preview() {
    const m = buildFromFold({ kind, hinge, slider });
    setMeshes(m);
  }

  async function commit() {
    const res = await fetch('/builders/neutral', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, hinge, slider }),
    });
    const data = await res.json();
    setServerDigest(meshDigest(data.meshes[0]));
  }

  const localDigest = meshes ? meshDigest(meshes[0]) : '';
  const parity = localDigest && serverDigest && localDigest === serverDigest;

  return (
    <div>
      <h1>Workshop</h1>
      <label>
        Builder:
        <select value={kind} onChange={e => setKind(e.target.value as BuilderKind)}>
          {kinds.map(k => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      </label>
      <label>
        hinge:
        <input
          type="number"
          value={hinge}
          onChange={e => setHinge(parseFloat(e.target.value))}
        />
      </label>
      <label>
        slider:
        <input
          type="number"
          value={slider}
          onChange={e => setSlider(parseFloat(e.target.value))}
        />
      </label>
      <button onClick={preview}>Preview</button>
      <button onClick={commit}>Commit</button>
      {meshes && (
        <div>
          <pre>{JSON.stringify(meshes, null, 2)}</pre>
        </div>
      )}
      {localDigest && (
        <div>
          <p>local: {localDigest}</p>
          <p>viewer: {serverDigest || '(pending)'}</p>
          <p style={{ color: parity ? 'green' : 'red' }}>
            {parity ? 'digests match' : 'mismatch'}
          </p>
        </div>
      )}
    </div>
  );
}
