import React, { useState } from 'react';
import { thetaPrime } from '@vishnu/core';
import { hinge } from '../ui/popFold';

export default function SeamGate() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState('fixtures/sample.png');
  const [job, setJob] = useState<any>(null);
  const theta = thetaPrime(1, 1);
  const fold = hinge(open ? Math.PI / 4 : 0);

  async function upload() {
    const res = await fetch('/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file }),
    });
    const json = await res.json();
    setJob(json);
  }

  return (
    <div>
      <h1>
        Seam-Gate <span data-testid="theta">{theta.toFixed(3)}</span>
      </h1>
      <div
        className="lift"
        style={{
          transform: `rotateX(${fold.hinge ?? 0}rad)`,
          transition: 'transform 0.3s',
          width: '100px',
          height: '100px',
          background: '#ddd',
        }}
        onClick={() => setOpen((o) => !o)}
      >
        Lift
      </div>
      <div>
        <input
          value={file}
          onChange={(e) => setFile(e.target.value)}
          placeholder="path"
        />
        <button onClick={upload}>Upload Image → Fabricate</button>
      </div>
      {job && (
        <pre data-testid="job">{JSON.stringify(job, null, 2)}</pre>
      )}
    </div>
  );
}
