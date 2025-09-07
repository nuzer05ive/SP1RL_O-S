import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';

const run = process.env.RUN_ONLINE === '1' ? describe : describe.skip;

run('zenava pipeline', () => {
  const base = new URL('../fixtures/zenava/', import.meta.url);
  const arcade = JSON.parse(readFileSync(new URL('arcade_k.json', base), 'utf-8'));
  const fabricatePayload = JSON.parse(
    readFileSync(new URL('fabricate_winner.json', base), 'utf-8')
  );

  it('arcade -> fabricate -> finalize', async () => {
    const resA = await fetch('http://localhost:3000/zenava/arcade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(arcade),
    });
    const winner = await resA.json();
    expect(winner.id).toBe('b');

    const resF = await fetch('http://localhost:3000/zenava/fabricate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fabricatePayload),
    });
    const dataF = await resF.json();
    expect(dataF.meshes[0].geom.positions.length).toBeLessThan(100);

    const resFin = await fetch('http://localhost:3000/zenava/finalize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scene_id: 's1',
        mesh: dataF.meshes[0],
        coat: dataF.coat,
      }),
    });
    expect(resFin.status).toBe(200);
  });
});
