import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';

const run = process.env.RUN_ONLINE === '1' ? describe : describe.skip;

run('hdpc flow', () => {
  const base = new URL('../fixtures/hdpc/', import.meta.url);
  const intent = JSON.parse(readFileSync(new URL('intent.json', base), 'utf-8'));
  const design = JSON.parse(readFileSync(new URL('design.json', base), 'utf-8'));
  const trials = JSON.parse(readFileSync(new URL('trials.json', base), 'utf-8'));
  const finalize = JSON.parse(readFileSync(new URL('finalize.json', base), 'utf-8'));

  it('gates finalize on inhumane', async () => {
    const bad = { ...finalize, constraints: { ...finalize.constraints, humane: false } };
    const res = await fetch('http://localhost:3000/hdpc/finalize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bad),
    });
    expect(res.status).toBe(400);
  });

  it('runs full flow', async () => {
    await fetch('http://localhost:3000/hdpc/intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(intent),
    });
    await fetch('http://localhost:3000/hdpc/design', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(design),
    });
    await fetch('http://localhost:3000/hdpc/trials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trials),
    });
    const res = await fetch('http://localhost:3000/hdpc/finalize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalize),
    });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toHaveProperty('primeAddress');
    expect(data).toHaveProperty('finish');
  });
});
