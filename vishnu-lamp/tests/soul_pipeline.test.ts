import { describe, it, beforeEach, expect } from 'vitest';
import { ghostExtract } from '../packages/soul/src/ghostExtract';
import { sophiaBloom } from '../packages/soul/src/sophiaBloom';
import { mondayAnalyze } from '../packages/soul/src/mondayAnalyze';
import { mint } from '../packages/soul/src/mint';
import { updateSoulView, readSoulView } from '../apps/api/src/views';
import fs from 'fs';
import path from 'path';

const RUN = process.env.RUN_ONLINE === '1';

const soulPath = path.resolve('vishnu-lamp/data/soul.json');
const walPath = path.resolve('vishnu-lamp/data/wal.log');

(RUN ? describe : describe.skip)('soul pipeline', () => {
  const sceneHash = 'scene';

  beforeEach(async () => {
    await fs.promises.unlink(soulPath).catch(() => {});
    await fs.promises.unlink(walPath).catch(() => {});
  });

  it('ghost/extract yields deterministic seed for same input', () => {
    const a = ghostExtract({ text: 'hello ghost', sceneHash, reqId: '1' });
    const b = ghostExtract({ text: 'hello ghost', sceneHash, reqId: '1' });
    expect(a.seed.id).toBe(b.seed.id);
  });

  it('bloom/update merges small variants into same cluster', () => {
    const s1 = ghostExtract({ text: 'abc', sceneHash, reqId: '1' }).seed;
    const s2 = ghostExtract({ text: 'abc!', sceneHash, reqId: '2' }).seed;
    const clusters = sophiaBloom([s1, s2], sceneHash);
    expect(clusters.length).toBe(1);
  });

  it('mint rejects without .su, accepts with .su, updates ledger', async () => {
    const { seed, labels } = ghostExtract({ text: 'mint me', sceneHash, reqId: '3' });
    await updateSoulView({ taxonomy: { [seed.id]: { seed, labels } } });
    const cluster = sophiaBloom([seed], sceneHash)[0];
    const m = mondayAnalyze(seed, cluster);
    await updateSoulView({ rank: { [cluster.id]: m }, ledger: [] });
    const bad = mint({ ai: true, su: false, note: 'n', m, sceneHash, reqId: '4' });
    expect(bad.decision.ok).toBe(false);
    const good = mint({ ai: true, su: true, note: 'y', m, sceneHash, reqId: '5' });
    expect(good.decision.ok).toBe(true);
    await updateSoulView({ ledger: [good.receipt!] });
    const view = await readSoulView();
    expect(view.ledger.length).toBe(1);
  });
});
