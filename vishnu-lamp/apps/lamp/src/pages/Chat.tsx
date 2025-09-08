import { useState } from 'react';
import { parseTranscript, hingeOneLiner } from '../../../packages/core/src';
import { commit } from '../lib/api';
import type { PetalChunk } from '../../../packages/core/src/chatBraid';

export default function Chat() {
  const [lines, setLines] = useState('');
  const [chunk, setChunk] = useState<PetalChunk | null>(null);
  const [scores, setScores] = useState<any>(null);
  const [quip, setQuip] = useState('');
  const [human, setHuman] = useState(false);

  async function ingest() {
    const pcs = parseTranscript(lines.split('\n'));
    if (!pcs.length) return;
    const pc = pcs[0];
    setChunk(pc);
    await fetch('/chat/ingest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chunk: pc }),
    });
  }

  async function score() {
    if (!chunk) return;
    const res = await fetch('/chat/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chunk }),
    });
    const data = await res.json();
    setScores(data.scores);
    setQuip(hingeOneLiner(chunk.participants[0] ?? '', chunk.participants[1] ?? ''));
  }

  async function mint() {
    if (!chunk) return;
    const res = await fetch('/chat/mint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chunkId: chunk.id, human }),
    });
    if (res.ok) {
      await replay();
    }
  }

  async function replay() {
    if (!scores) return;
    const witnessSector = Math.floor(Date.now() / 137) % 8;
    const bloomLayer = scores.coherence > 0.75 ? 'outer' : 'inner';
    await commit('default', { witnessSector, bloomLayer });
  }

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: 1 }}>
        <textarea
          value={lines}
          onChange={(e) => setLines(e.target.value)}
          rows={10}
          cols={30}
        />
        <div>
          <button onClick={ingest}>Parse</button>
          <button onClick={score}>Score</button>
        </div>
        <ul>
          {chunk?.turns.map((t, i) => (
            <li key={i}>
              [{t.tag}/{t.role}] {t.surface}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ flex: 1 }}>
        {scores && (
          <div>
            <p>coherence: {scores.coherence.toFixed(3)}</p>
            <p>edgeDensity: {scores.edgeDensity.toFixed(3)}</p>
            <p>leastAction: {scores.leastAction.toFixed(3)}</p>
            <p>zcm: {scores.zcm.toFixed(3)}</p>
            <p>{quip}</p>
          </div>
        )}
      </div>
      <div style={{ flex: 1 }}>
        <label>
          <input
            type="checkbox"
            checked={human}
            onChange={(e) => setHuman(e.target.checked)}
          />{' '}
          Human approves (.su)
        </label>
        <div>
          <button onClick={mint}>Mint</button>
          <button onClick={replay}>Replay as Petal</button>
        </div>
      </div>
    </div>
  );
}
