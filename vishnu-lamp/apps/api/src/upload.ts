import { Router } from 'express';
import crypto from 'crypto';
import { spawnSync } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { append } from './wal';
import { readUploadJob, writeUploadJob } from './views';

const router = Router();

function eventId(sceneHash: string, reqId: string, tag: string): string {
  return crypto.createHmac('sha256', sceneHash).update(reqId + tag).digest('hex');
}

router.post('/upload', async (req, res) => {
  const { file = 'fixtures/sample.png', reqId = 'req', sceneHash = 'scene' } = req.body || {};
  const id = crypto
    .createHmac('sha256', sceneHash)
    .update(reqId + file)
    .digest('hex');
  const src = new URL(`../../${file}`, import.meta.url);
  const ext = path.extname(file) || '.bin';
  const dest = new URL(`../../data/uploads/${id}${ext}`, import.meta.url);
  await fs.mkdir(path.dirname(dest.pathname), { recursive: true });
  await fs.copyFile(src, dest);
  await append({
    id: eventId(sceneHash, reqId, 'UPLOAD_RECEIVED'),
    t: new Date().toISOString(),
    type: 'UPLOAD_RECEIVED',
    scene_id: sceneHash,
    user_id: 'offline',
    req_id: reqId,
    model_semver: '0',
    kernel_digest: 'none',
    payload: { id, file: dest.pathname },
    status: 'OK',
  });
  const mesh = new URL(`../../data/uploads/${id}_mesh.json`, import.meta.url);
  const worker = spawnSync('python', [
    new URL('../../workers/sgk/seam_gate.py', import.meta.url).pathname,
    '--in',
    dest.pathname,
    '--out',
    mesh.pathname,
    '--seed',
    id.slice(0, 8),
  ]);
  const status = worker.status === 0 ? 'done' : 'failed';
  await append({
    id: eventId(sceneHash, reqId, 'UPLOAD_FABRICATED'),
    t: new Date().toISOString(),
    type: 'UPLOAD_FABRICATED',
    scene_id: sceneHash,
    user_id: 'offline',
    req_id: reqId,
    model_semver: '0',
    kernel_digest: 'none',
    payload: { id, mesh: mesh.pathname, status },
    status: status === 'done' ? 'OK' : 'FAILED',
  });
  const job = { id, status, file: dest.pathname, mesh: mesh.pathname };
  await writeUploadJob(job);
  res.json(job);
});

router.get('/upload/:id', async (req, res) => {
  const job = await readUploadJob(req.params.id);
  if (!job) {
    res.status(404).json({ error: 'not found' });
    return;
  }
  res.json(job);
});

export default router;
