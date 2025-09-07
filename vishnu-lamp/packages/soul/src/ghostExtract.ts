import crypto from 'crypto';
import { GhostSeed, WeakLabels } from './types';

export interface ExtractInput {
  text?: string;
  imageMeta?: Record<string, unknown>;
  sceneHash: string;
  reqId: string;
}

function shingleText(text: string): string[] {
  const words = text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
  const grams: string[] = [];
  const n = 3;
  for (let i = 0; i <= words.length - n; i++) {
    grams.push(words.slice(i, i + n).join(' '));
  }
  return grams.length ? grams : words;
}

export function ghostExtract(input: ExtractInput): {
  seed: GhostSeed;
  labels: WeakLabels;
} {
  const base = input.text ?? JSON.stringify(input.imageMeta ?? {});
  const shingles = shingleText(base);
  const id = crypto
    .createHmac('sha256', input.sceneHash)
    .update(input.reqId + base)
    .digest('hex');
  const seed: GhostSeed = { id, shingles };
  const labels: WeakLabels = { length: base.length };
  return { seed, labels };
}
