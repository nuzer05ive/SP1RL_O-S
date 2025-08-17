const REGISTRY_URL = '/SP1RL_O-S-core/codex/_registry/manifest.json';
const IMPORT_MAP_URL = '/SP1RL_O-S-core/codex/_runtime/importmap.json';
const cache = {};
let map = {};

export async function init() {
  try {
    const [manifest, base] = await Promise.all([
      fetch(REGISTRY_URL).then(r => r.json()),
      fetch(IMPORT_MAP_URL).then(r => r.json())
    ]);
    map = { ...(base.imports || {}) };
    (manifest.modules || []).forEach(m => {
      map[m.id] = m.entry;
    });
  } catch (_) {
    try {
      const base = await fetch(IMPORT_MAP_URL).then(r => r.json());
      map = { ...(base.imports || {}) };
    } catch (e) {
      map = {};
    }
  }
}

export async function load(id) {
  const entry = map[id];
  if (!entry) {
    return {};
  }
  if (cache[id]) {
    return cache[id];
  }
  try {
    const mod = await import(entry);
    cache[id] = mod;
    return mod;
  } catch (e) {
    return {};
  }
}

export async function hotSwap(id, newEntry) {
  map[id] = newEntry;
  delete cache[id];
  return load(id);
}

export function unload(id) {
  delete cache[id];
}

export function require(ids) {
  return {
    async withFallbacks() {
      const mods = {};
      for (const id of ids) {
        mods[id] = await load(id);
      }
      return mods;
    }
  };
}
