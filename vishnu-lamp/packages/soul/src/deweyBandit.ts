import crypto from 'crypto';
import { BanditAction, GhostSeed, WeakLabels } from './types';

const PHI = (1 + Math.sqrt(5)) / 2;

export function deweyBandit(
  seed: GhostSeed,
  labels: WeakLabels,
  step: number,
  sceneHash: string,
  reqId: string
): BanditAction {
  const epsilon = Math.pow(1 / PHI, step + 1);
  const keys = Object.keys(labels);
  let arm = 'none';
  if (keys.length > 0) {
    const h = crypto
      .createHmac('sha256', sceneHash)
      .update(reqId + seed.id)
      .digest('hex');
    const r = parseInt(h.slice(0, 8), 16) / 0xffffffff;
    if (r < epsilon) {
      const idx = Math.floor(r * keys.length);
      arm = keys[idx];
    } else {
      arm = keys.reduce((a, b) => (labels[a] > labels[b] ? a : b));
    }
  }
  const reward = labels[arm] ?? 0;
  return { arm, epsilon, reward };
}
