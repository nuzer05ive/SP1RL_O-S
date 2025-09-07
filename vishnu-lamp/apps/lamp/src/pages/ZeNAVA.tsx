import { useState } from 'react';

export default function ZeNAVA() {
  const [candidate, setCandidate] = useState<any | null>(null);
  const [fabricated, setFabricated] = useState<any | null>(null);
  const [done, setDone] = useState(false);

  async function arcade() {
    const payload = {
      scene_id: 's1',
      candidates: [
        { id: 'a', L: 10 },
        { id: 'b', L: 5 },
      ],
    };
    const res = await fetch('/zenava/arcade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setCandidate(await res.json());
  }

  async function fabricate() {
    if (!candidate) return;
    const res = await fetch('/zenava/fabricate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scene_id: 's1', winner: candidate }),
    });
    setFabricated(await res.json());
  }

  async function finalize() {
    if (!fabricated) return;
    await fetch('/zenava/finalize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scene_id: 's1',
        mesh: fabricated.meshes[0],
        coat: fabricated.coat,
      }),
    });
    setDone(true);
  }

  return (
    <div>
      <h1>ZeN_AVA Mother-Claw</h1>
      {!candidate && <button onClick={arcade}>Arcade</button>}
      {candidate && !fabricated && (
        <div>
          <pre>{JSON.stringify(candidate, null, 2)}</pre>
          <button onClick={fabricate}>Fabricate</button>
        </div>
      )}
      {fabricated && !done && (
        <div>
          <pre>{JSON.stringify(fabricated, null, 2)}</pre>
          <button onClick={finalize}>Finalize</button>
        </div>
      )}
      {done && <p>Finalized!</p>}
    </div>
  );
}
