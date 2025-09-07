import { Router } from 'express';
import crypto from 'crypto';
import { ghostExtract } from '../../packages/soul/src/ghostExtract';
import { deweyBandit } from '../../packages/soul/src/deweyBandit';
import { sophiaBloom } from '../../packages/soul/src/sophiaBloom';
import { mondayAnalyze } from '../../packages/soul/src/mondayAnalyze';
import { mint } from '../../packages/soul/src/mint';
import { append } from './wal';
import { readSoulView, updateSoulView } from './views';

const router = Router();

function eventId(sceneHash: string, reqId: string, tag: string): string {
  return crypto.createHmac('sha256', sceneHash).update(reqId + tag).digest('hex');
}

router.post('/ghost/extract', async (req, res) => {
  const { text, image, reqId = 'req', sceneHash = 'scene' } = req.body || {};
  const { seed, labels } = ghostExtract({
    text,
    imageMeta: image,
    sceneHash,
    reqId,
  });
  await append({
    id: eventId(sceneHash, reqId, 'GHOST_EXTRACT'),
    t: new Date().toISOString(),
    type: 'GHOST_EXTRACT',
    scene_id: sceneHash,
    user_id: 'offline',
    req_id: reqId,
    model_semver: '0',
    kernel_digest: 'none',
    payload: { seed, labels },
    status: 'OK',
  });
  await updateSoulView({ taxonomy: { [seed.id]: { seed, labels } } });
  res.json({ seed, labels });
});

router.post('/bloom/update', async (req, res) => {
  const { seedId, step = 0, reqId = 'req', sceneHash = 'scene' } = req.body || {};
  const soul = await readSoulView();
  const entry = soul.taxonomy[seedId];
  if (!entry) {
    res.status(404).json({ error: 'seed not found' });
    return;
  }
  const action = deweyBandit(entry.seed, entry.labels, step, sceneHash, reqId);
  await append({
    id: eventId(sceneHash, reqId, 'BANDIT_STEP'),
    t: new Date().toISOString(),
    type: 'BANDIT_STEP',
    scene_id: sceneHash,
    user_id: 'offline',
    req_id: reqId,
    model_semver: '0',
    kernel_digest: 'none',
    payload: { seedId, action },
    status: 'OK',
  });
  const clusters = sophiaBloom([entry.seed], sceneHash);
  const cluster = clusters[0];
  await append({
    id: eventId(sceneHash, reqId, 'BLOOM_UPDATE'),
    t: new Date().toISOString(),
    type: 'BLOOM_UPDATE',
    scene_id: sceneHash,
    user_id: 'offline',
    req_id: reqId,
    model_semver: '0',
    kernel_digest: 'none',
    payload: { seedId, cluster },
    status: 'OK',
  });
  const m = mondayAnalyze(entry.seed, cluster);
  await updateSoulView({ rank: { [cluster.id]: m } });
  let recommend = false;
  if (m > 1) {
    recommend = true;
    await append({
      id: eventId(sceneHash, reqId, 'RECOMMEND'),
      t: new Date().toISOString(),
      type: 'RECOMMEND',
      scene_id: sceneHash,
      user_id: 'offline',
      req_id: reqId,
      model_semver: '0',
      kernel_digest: 'none',
      payload: { seedId, cluster: cluster.id, m },
      status: 'OK',
    });
  }
  res.json({ cluster: cluster.id, m, recommend });
});

router.post('/mint', async (req, res) => {
  const { ai, su, note, m = 0, reqId = 'req', sceneHash = 'scene' } = req.body || {};
  const { decision, receipt } = mint({ ai, su, note, m, sceneHash, reqId });
  if (decision.ok && receipt) {
    await append({
      id: eventId(sceneHash, reqId, 'MINT'),
      t: new Date().toISOString(),
      type: 'MINT',
      scene_id: sceneHash,
      user_id: 'offline',
      req_id: reqId,
      model_semver: '0',
      kernel_digest: 'none',
      payload: { receipt },
      status: 'OK',
    });
    const soul = await readSoulView();
    await updateSoulView({ ledger: [...soul.ledger, receipt] });
  }
  res.json({ decision, receipt });
});

export default router;
