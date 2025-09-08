import { promises as fs } from 'fs';
import { readAll, WalEvent } from './wal';
import type { ReactorState } from '@vishnu/core/reactorMath';
import type { GhostSeed, WeakLabels, MintReceipt } from '../../packages/soul/src/types';

const SCENE_DIR = new URL('../../data/scenes/', import.meta.url);
const SOUL_PATH = new URL('../../data/soul.json', import.meta.url);
const UPLOAD_DIR = new URL('../../data/uploads/', import.meta.url);

export interface SceneView {
  characters: any[];
  assets: any[];
  reactor?: ReactorView;
  [key: string]: any;
}

export interface ReactorView extends ReactorState {
  history: ReactorState[];
}

export interface SoulView {
  taxonomy: Record<string, { seed: GhostSeed; labels: WeakLabels }>;
  rank: Record<string, number>;
  ledger: MintReceipt[];
}

export interface UploadJob {
  id: string;
  status: string;
  file: string;
  mesh: string;
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
    const history = await reactorHistory(sceneId);
    const latest = history[history.length - 1];
    return {
      characters: [],
      assets: [],
      ...json,
      reactor: latest ? { ...latest, history } : undefined,
    };
  } catch {
    const history = await reactorHistory(sceneId);
    const latest = history[history.length - 1];
    return {
      characters: [],
      assets: [],
      reactor: latest ? { ...latest, history } : undefined,
    };
  }
}

export async function reactorHistory(sceneId: string): Promise<ReactorState[]> {
  const events = await readAll();
  return events
    .filter((e) => e.scene_id === sceneId && e.type === 'REACTOR_UPDATE')
    .map((e) => e.telemetry?.reactor)
    .filter(Boolean) as ReactorState[];
}

export function reducer(scene: SceneView, event: WalEvent): SceneView {
  if (event.type === 'REACTOR_UPDATE' && event.telemetry?.reactor) {
    const history = [...(scene.reactor?.history ?? []), event.telemetry.reactor];
    return { ...scene, reactor: { ...event.telemetry.reactor, history } };
  }
  return scene;
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

export async function readSoulView(): Promise<SoulView> {
  try {
    const data = await fs.readFile(SOUL_PATH, 'utf-8');
    return JSON.parse(data) as SoulView;
  } catch {
    return { taxonomy: {}, rank: {}, ledger: [] };
  }
}

export async function updateSoulView(patch: Partial<SoulView>): Promise<SoulView> {
  const current = await readSoulView();
  const next: SoulView = {
    taxonomy: { ...current.taxonomy, ...(patch.taxonomy ?? {}) },
    rank: { ...current.rank, ...(patch.rank ?? {}) },
    ledger: patch.ledger ?? current.ledger,
  };
  await fs.writeFile(SOUL_PATH, JSON.stringify(next, null, 2));
  return next;
}

export async function readUploadJob(id: string): Promise<UploadJob | null> {
  try {
    const data = await fs.readFile(new URL(`${id}.json`, UPLOAD_DIR), 'utf-8');
    return JSON.parse(data) as UploadJob;
  } catch {
    return null;
  }
}

export async function writeUploadJob(job: UploadJob): Promise<void> {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(new URL(`${job.id}.json`, UPLOAD_DIR), JSON.stringify(job, null, 2));
}

interface ViewsState {
  petal_index: Record<string, any>;
}

const state: ViewsState = { petal_index: {} };

export function getState(): ViewsState {
  return state;
}

export async function reduceViews(): Promise<void> {
  const events = await readAll();
  state.petal_index = {};
  for (const e of events) {
    if (e.type === 'CHAT_INSERTED') {
      const { chunk } = e.payload as any;
      const participants = Array.from(
        new Set((chunk.turns || []).map((t: any) => t.role).filter(Boolean))
      );
      state.petal_index[chunk.id] = {
        turns: chunk.turns,
        participants,
        closure: chunk.closure,
      };
    } else if (e.type === 'CHAT_SCORED') {
      const { chunkId, scores } = e.payload as any;
      const item = state.petal_index[chunkId];
      if (item) {
        item.scores = scores;
        item.witnessSector = Math.floor(Date.now() / 137) % 8;
        item.bloomLayer = scores.coherence > 0.75 ? 'outer' : 'inner';
      }
    } else if (e.type === 'CHAT_MINTED') {
      const { chunkId, primeAddress } = e.payload as any;
      const item = state.petal_index[chunkId];
      if (item) {
        item.minted = true;
        item.primeAddress = primeAddress;
      }
    }
  }
}
