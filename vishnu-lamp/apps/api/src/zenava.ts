import express from 'express';
import { randomUUID } from 'crypto';
import {
  zenavaArcadeSchema,
  zenavaFabricateSchema,
  zenavaFinalizeSchema,
} from './validators';
import { append, WalEvent } from './wal';
import { updateScene, sceneSnapshot } from './views';
import { chooseMin } from '../../packages/zenava/src/ClawKernel';
import { fabricate as fabricateSpecimen } from '../../packages/zenava/src/Specimen';

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

router.post('/zenava/arcade', async (req, res) => {
  const parsed = zenavaArcadeSchema.parse(req.body);
  const winner = chooseMin(parsed.candidates);
  const ev = baseEvent(parsed.scene_id, 'ZENAVA_ARCADE', { winner });
  await append(ev);
  res.json(winner);
});

router.post('/zenava/fabricate', async (req, res) => {
  const parsed = zenavaFabricateSchema.parse(req.body);
  const result = fabricateSpecimen(parsed.winner);
  const ev = baseEvent(parsed.scene_id, 'ZENAVA_FABRICATE', result);
  await append(ev);
  res.json(result);
});

router.post('/zenava/finalize', async (req, res) => {
  try {
    const parsed = zenavaFinalizeSchema.parse(req.body);
    const ev = baseEvent(parsed.scene_id, 'ZENAVA_FINALIZE', {
      mesh: parsed.mesh,
      coat: parsed.coat,
    });
    await append(ev);
    const scene = await sceneSnapshot(parsed.scene_id);
    await updateScene(parsed.scene_id, {
      assets: [...scene.assets, { mesh: parsed.mesh, coat: parsed.coat }],
    });
    res.json({ ok: true });
  } catch (err: any) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

export default router;
