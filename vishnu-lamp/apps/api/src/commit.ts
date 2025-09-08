import express from 'express';
import { randomUUID } from 'crypto';
import { append, WalEvent } from './wal';
import type { ScenePatch } from '@vishnu/core';
import type { ReactorState } from '@vishnu/core/reactorMath';

const router = express.Router();

router.post('/commit', async (req, res) => {
  const { scene_id = 'default', patch, telemetry, reactorHint } = req.body as {
    scene_id?: string;
    patch: ScenePatch;
    telemetry?: { reactor?: ReactorState };
    reactorHint?: boolean;
  };
  const commitId = randomUUID();
  let fullPatch = patch;
  if (telemetry?.reactor) {
    fullPatch = {
      ...patch,
      materials: { ...(patch as any).materials, coat: telemetry.reactor.coat },
      cadence: { ...(patch as any).cadence, tauBandit: telemetry.reactor.tauBandit },
      pll: { ...(patch as any).pll, kappaPLL: telemetry.reactor.kappaPLL },
    } as ScenePatch;
  }
  const event: WalEvent = {
    id: commitId,
    t: new Date().toISOString(),
    type: 'COMMIT',
    scene_id,
    user_id: req.body.user_id || 'u-0',
    req_id: commitId,
    model_semver: 'v1.0.0',
    kernel_digest: 'sha256:none',
    payload: { patch: fullPatch },
    status: 'OK',
    telemetry,
  };
  await append(event);
  res.json({ ok: true, commit_id: commitId });
  if (reactorHint || telemetry?.reactor) {
    const rEvent: WalEvent = {
      id: randomUUID(),
      t: new Date().toISOString(),
      type: 'REACTOR_UPDATE',
      scene_id,
      user_id: req.body.user_id || 'u-0',
      req_id: commitId,
      model_semver: 'v1.0.0',
      kernel_digest: 'sha256:none',
      payload: {},
      status: 'OK',
      telemetry,
    };
    append(rEvent).catch(() => {});
  }
});

export default router;
