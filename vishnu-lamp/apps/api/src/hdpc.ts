import express from 'express';
import { randomUUID } from 'crypto';
import {
  hdpcIntentSchema,
  hdpcDesignSchema,
  hdpcTrialsSchema,
  hdpcFinalizeSchema,
} from './validators';
import { append, WalEvent } from './wal';
import { updateScene, sceneSnapshot } from './views';
import { finalize as finalizeHDPC } from '../../packages/hdpc/src/Finalize';

const router = express.Router();

function baseEvent(scene_id: string, type: WalEvent['type'], payload: any): WalEvent {
  const id = randomUUID();
  return {
    id,
    t: new Date().toISOString(),
    type,
    scene_id,
    user_id: 'u-0',
    req_id: id,
    model_semver: 'v1.0.0',
    kernel_digest: 'sha256:none',
    payload,
    status: 'OK',
  };
}

router.post('/hdpc/intent', async (req, res) => {
  const parsed = hdpcIntentSchema.parse(req.body);
  const ev = baseEvent(parsed.scene_id, 'HDPC_INTENT', parsed);
  await append(ev);
  await updateScene(parsed.scene_id, { intent: parsed });
  res.json({ ok: true });
});

router.post('/hdpc/design', async (req, res) => {
  const parsed = hdpcDesignSchema.parse(req.body);
  const ev = baseEvent(parsed.scene_id, 'HDPC_DESIGN', parsed);
  await append(ev);
  await updateScene(parsed.scene_id, { design: parsed });
  res.json({ ok: true });
});

router.post('/hdpc/trials', async (req, res) => {
  const parsed = hdpcTrialsSchema.parse(req.body);
  const ev = baseEvent(parsed.scene_id, 'HDPC_TRIALS', parsed);
  await append(ev);
  await updateScene(parsed.scene_id, { trials: parsed.hats });
  res.json({ ok: true });
});

router.post('/hdpc/finalize', async (req, res) => {
  try {
    const parsed = hdpcFinalizeSchema.parse(req.body);
    const scene = await sceneSnapshot(parsed.scene_id);
    const seed = JSON.stringify(scene);
    const final = finalizeHDPC(parsed.hats, parsed.constraints, seed);
    const ev = baseEvent(parsed.scene_id, 'HDPC_FINALIZE', final);
    await append(ev);
    await updateScene(parsed.scene_id, {
      characters: [...scene.characters, final],
    });
    res.json(final);
  } catch (err: any) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

export default router;
