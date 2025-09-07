import React, { useState } from 'react';

export default function Soul() {
  const [text, setText] = useState('');
  const [seed, setSeed] = useState<any>(null);
  const [m, setM] = useState(0);
  const [ai, setAi] = useState(false);
  const [su, setSu] = useState(false);
  const [note, setNote] = useState('');

  async function extract() {
    const res = await fetch('/ghost/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const json = await res.json();
    setSeed(json.seed);
  }

  async function bloom() {
    if (!seed) return;
    const res = await fetch('/bloom/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seedId: seed.id }),
    });
    const json = await res.json();
    setM(json.m);
  }

  async function doMint() {
    const res = await fetch('/mint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ai, su, note, m }),
    });
    const json = await res.json();
    alert(JSON.stringify(json));
  }

  return (
    <div>
      <h1>Soul</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="text"
      />
      <button onClick={extract}>Extract</button>
      {seed && (
        <div>
          <p data-testid="seed-id">Seed: {seed.id}</p>
          <button onClick={bloom}>Bandit step & Bloom</button>
        </div>
      )}
      <p data-testid="m-score">M: {m.toFixed(3)}</p>
      <label>
        <input type="checkbox" checked={ai} onChange={(e) => setAi(e.target.checked)} />
        .ai
      </label>
      <label>
        <input type="checkbox" checked={su} onChange={(e) => setSu(e.target.checked)} />
        .su
      </label>
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="note"
      />
      <button onClick={doMint} disabled={!(ai && su)}>
        Mint
      </button>
    </div>
  );
}
