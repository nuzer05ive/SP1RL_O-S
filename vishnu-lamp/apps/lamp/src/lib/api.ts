import { createHash } from 'crypto';
import type { ScenePatch } from '@vishnu/core';

function deterministicId(patch: ScenePatch): string {
  try {
    return createHash('sha256').update(JSON.stringify(patch)).digest('hex');
  } catch {
    // browser fallback
    return Math.random().toString(36).slice(2);
  }
}

export async function commit(sceneId: string, patch: ScenePatch, opts: RequestInit = {}) {
  const reqId = deterministicId(patch);
  const res = await fetch('/api/commit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': reqId,
    },
    body: JSON.stringify({ scene_id: sceneId, patch }),
    ...opts,
  });
  if (!res.ok) {
    throw new Error('commit failed');
  }
  return res.json();
}
