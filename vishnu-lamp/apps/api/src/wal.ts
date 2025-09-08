import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';
import type { ReactorState } from '@vishnu/core/reactorMath';

export type WalEventType =
  | 'ARM'
  | 'COMMIT'
  | 'HDPC_INTENT'
  | 'HDPC_DESIGN'
  | 'HDPC_TRIALS'
  | 'HDPC_FINALIZE'
  | 'ZENAVA_ARCADE'
  | 'ZENAVA_FABRICATE'
  | 'ZENAVA_FINALIZE'
  | 'GHOST_EXTRACT'
  | 'BANDIT_STEP'
  | 'BLOOM_UPDATE'
  | 'RECOMMEND'
  | 'MINT'
  | 'UPLOAD_RECEIVED'
  | 'UPLOAD_FABRICATED'
  | 'REACTOR_UPDATE'
  | 'CHAT_INSERTED'
  | 'CHAT_SCORED'
  | 'CHAT_MINTED';

export interface WalEvent {
  id: string;
  t: string;
  type: WalEventType;
  scene_id: string;
  user_id: string;
  req_id: string;
  model_semver: string;
  kernel_digest: string;
  payload: Record<string, unknown>;
  status: 'OK' | 'FAILED';
  telemetry?: { reactor?: ReactorState };
}

const WAL_PATH = new URL('../../data/wal.log', import.meta.url);

export async function append(event: WalEvent): Promise<void> {
  await fs.appendFile(WAL_PATH, JSON.stringify(event) + '\n');
}

export async function appendEvent(
  evt: Omit<WalEvent, 'id' | 't' | 'scene_id' | 'user_id' | 'req_id' | 'model_semver' | 'kernel_digest'>
): Promise<void> {
  const event: WalEvent = {
    id: randomUUID(),
    t: new Date().toISOString(),
    scene_id: 'default',
    user_id: 'u-0',
    req_id: randomUUID(),
    model_semver: 'v1.0.0',
    kernel_digest: 'sha256:none',
    ...evt,
  };
  await append(event);
}

export async function readAll(): Promise<WalEvent[]> {
  try {
    const data = await fs.readFile(WAL_PATH, 'utf-8');
    return data
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((l) => JSON.parse(l) as WalEvent);
  } catch {
    return [];
  }
}
