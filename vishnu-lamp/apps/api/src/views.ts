import { readAll } from './wal';
import { WalEvent } from '@vishnu/core';

export async function commitChain(sceneId: string): Promise<WalEvent[]> {
  const events = await readAll();
  return events.filter(
    (e) => e.scene_id === sceneId && (e.type === 'ARM' || e.type === 'COMMIT')
  );
}

export async function sceneSnapshot(sceneId: string): Promise<Record<string, unknown>> {
  const chain = await commitChain(sceneId);
  const latest = chain.filter((e) => e.type === 'COMMIT').pop();
  return latest ? latest.payload : {};
}
