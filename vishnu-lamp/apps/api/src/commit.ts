import express from 'express';
import { createHmac, randomUUID } from 'crypto';
import { append } from './wal';
import { sceneSnapshot } from './views';

const router = express.Router();
const idempotency = new Map<string, string>();

function deterministicSeed(sceneHash: string, reqId: string, seedsHash: string): string {
  return createHmac('sha256', sceneHash).update(reqId + seedsHash).digest('hex');
}

router.post('/arm', async (req, res) => {
  const reqId = req.headers['idempotency-key']?.toString() || randomUUID();
  if (idempotency.has(reqId)) {
    return res.json({ req_id: idempotency.get(reqId) });
  }
  idempotency.set(reqId, reqId);
  const event = {
    id: randomUUID(),
    t: new Date().toISOString(),
    type: 'ARM',
    scene_id: req.body.scene_id || 'default',
    user_id: req.body.user_id || 'u-0',
    req_id: reqId,
    model_semver: 'v1.0.0',
    kernel_digest: 'sha256:none',
    payload: req.body.payload || {},
    status: 'OK' as const
  };
  await append(event);
  res.json({ req_id: reqId });
});

router.post('/commit', async (req, res) => {
  const reqId = req.headers['idempotency-key']?.toString() || randomUUID();
  if (idempotency.has(reqId)) {
    return res.json({ req_id: idempotency.get(reqId) });
  }
  idempotency.set(reqId, reqId);
  const sceneId = req.body.scene_id || 'default';
  const snapshot = await sceneSnapshot(sceneId);
  const sceneHash = createHmac('sha256', 'scene').update(JSON.stringify(snapshot)).digest('hex');
  const seed = deterministicSeed(sceneHash, reqId, 'seed');
  const event = {
    id: randomUUID(),
    t: new Date().toISOString(),
    type: 'COMMIT',
    scene_id: sceneId,
    user_id: req.body.user_id || 'u-0',
    req_id: reqId,
    model_semver: 'v1.0.0',
    kernel_digest: 'sha256:none',
    payload: { ...req.body.payload, seed },
    status: 'OK' as const
  };
  await append(event);
  res.json({ req_id: reqId, seed });
});

export default router;
