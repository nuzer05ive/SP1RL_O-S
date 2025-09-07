import { promises as fs } from 'fs';
import { readAll, WalEvent } from './wal';

const SCENE_DIR = new URL('../../data/scenes/', import.meta.url);

export interface SceneView {
  characters: any[];
  assets: any[];
  [key: string]: any;
}

export async function commitChain(sceneId: string): Promise<WalEvent[]> {
  const events = await readAll();
  return events.filter(
    (e) => e.scene_id === sceneId && (e.type === 'ARM' || e.type === 'COMMIT')
  );
}

export async function sceneSnapshot(sceneId: string): Promise<SceneView> {
  const path = new URL(`${sceneId}.json`, SCENE_DIR);
  try {
    const data = await fs.readFile(path, 'utf-8');
    const json = JSON.parse(data) as SceneView;
    return { characters: [], assets: [], ...json };
  } catch {
    return { characters: [], assets: [] };
  }
}

export async function updateScene(
  sceneId: string,
  patch: Partial<SceneView>
): Promise<SceneView> {
  const current = await sceneSnapshot(sceneId);
  const next = { ...current, ...patch };
  await fs.mkdir(SCENE_DIR, { recursive: true });
  const path = new URL(`${sceneId}.json`, SCENE_DIR);
  await fs.writeFile(path, JSON.stringify(next, null, 2));
  return next;
}
