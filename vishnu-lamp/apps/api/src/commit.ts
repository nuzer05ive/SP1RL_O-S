import express from 'express';
import { randomUUID } from 'crypto';
import { append } from './wal';
import type { ScenePatch, WalEvent } from '@vishnu/core';

const router = express.Router();

router.post('/commit', async (req, res) => {
  const { scene_id = 'default', patch } = req.body as {
    scene_id?: string;
    patch: ScenePatch;
  };
  const commitId = randomUUID();
  const event: WalEvent = {
    id: commitId,
    t: new Date().toISOString(),
    type: 'COMMIT',
    scene_id,
    user_id: req.body.user_id || 'u-0',
    req_id: commitId,
    model_semver: 'v1.0.0',
    kernel_digest: 'sha256:none',
    payload: { patch },
    status: 'OK',
  };
  await append(event);
  res.json({ ok: true, commit_id: commitId });
});

export default router;
