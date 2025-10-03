import type { ModuleRecord } from './sqlite/worker';

let worker: Worker | null = null;
let requestId = 0;
const pending = new Map<number, (rows: ModuleRecord[]) => void>();
let cache: ModuleRecord[] | null = null;

function ensureWorker() {
  if (!worker && typeof window !== 'undefined') {
    worker = new Worker(new URL('./sqlite/worker.ts', import.meta.url), { type: 'module' });
    worker.addEventListener('message', (event: MessageEvent<{ type: string; rows: ModuleRecord[]; requestId: number }>) => {
      const { requestId: id, rows } = event.data;
      const resolve = pending.get(id);
      if (resolve) {
        pending.delete(id);
        resolve(rows);
      }
    });
  }
  return worker;
}

async function loadModulesFromNetwork(): Promise<ModuleRecord[]> {
  const response = await fetch('/modules.json');
  const modules = (await response.json()) as ModuleRecord[];
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('spirl.registry', JSON.stringify(modules));
  }
  const sqlite = ensureWorker();
  sqlite?.postMessage({ type: 'init', modules });
  return modules;
}

export async function loadModules(): Promise<ModuleRecord[]> {
  if (cache) return cache;
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('spirl.registry');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ModuleRecord[];
        cache = parsed;
        ensureWorker()?.postMessage({ type: 'init', modules: parsed });
        return parsed;
      } catch {
        // ignore and fetch fresh
      }
    }
  }
  cache = await loadModulesFromNetwork();
  return cache;
}

export async function queryModules(search: string): Promise<ModuleRecord[]> {
  const sqlite = ensureWorker();
  const modules = await loadModules();
  if (!sqlite) {
    if (!search) return modules;
    const term = search.toLowerCase();
    return modules.filter((module) => module.name.toLowerCase().includes(term) || module.id.toLowerCase().includes(term));
  }
  return new Promise<ModuleRecord[]>((resolve) => {
    const id = ++requestId;
    pending.set(id, resolve);
    sqlite.postMessage({ type: 'query', sql: 'select * from modules where name like ?', params: [`%${search}%`], requestId: id });
  });
}

export type Module = ModuleRecord;
