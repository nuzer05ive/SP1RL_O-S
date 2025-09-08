import express from 'express';
import { appendEvent } from './wal';
import { reduceViews, getState } from './views';
import { PetalChunk, scoreChunk } from '../../packages/core/src';

const r = express.Router();

r.post('/chat/ingest', async (req, res) => {
  const { chunk } = req.body as { chunk: PetalChunk };
  if (!chunk?.turns?.length)
    return res.status(400).json({ error: 'empty chunk' });
  await appendEvent({
    type: 'CHAT_INSERTED',
    payload: { chunk },
    status: 'OK',
  });
  await reduceViews();
  res.json({ ok: true, id: chunk.id });
});

r.post('/chat/score', async (req, res) => {
  const { chunk } = req.body as { chunk: PetalChunk };
  if (!chunk) return res.status(400).json({ error: 'missing chunk' });
  const scored = scoreChunk(chunk);
  await appendEvent({
    type: 'CHAT_SCORED',
    payload: { chunkId: scored.id, scores: scored.scores },
    status: 'OK',
  });
  await reduceViews();
  res.json({ ok: true, scores: scored.scores });
});

r.post('/chat/mint', async (req, res) => {
  const { chunkId, human } = req.body as { chunkId: string; human: boolean };
  if (!chunkId) return res.status(400).json({ error: 'missing chunkId' });
  if (!human) return res.status(400).json({ error: '.su approval required' });
  const state = getState();
  const petal = (state as any).petal_index?.[chunkId];
  const aiOK = (petal?.scores?.zcm ?? 0) >= 0.8;
  if (!aiOK) return res.status(400).json({ error: '.ai declined (zcm too low)' });
  await appendEvent({
    type: 'CHAT_MINTED',
    payload: { chunkId, primeAddress: 'PP:TP(89)@φ43:34:step34~J:1' },
    status: 'OK',
  });
  await reduceViews();
  res.json({ ok: true });
});

r.get('/chat/:id', (req, res) => {
  const state = getState();
  const chunk = (state as any).petal_index?.[req.params.id];
  if (!chunk) return res.status(404).json({ error: 'not found' });
  res.json(chunk);
});

export default r;
