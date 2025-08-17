const REGISTRY_URL = '/SP1RL_O-S-core/codex/_registry/manifest.json';
const IMPORT_MAP_URL = '/SP1RL_O-S-core/codex/_runtime/importmap.json';
const cache = {};
const map = new Map();

function emit(detail) {
  window.dispatchEvent(new CustomEvent('SP1RL_BUS_V1', { detail }));
}

async function init(opts = {}) {
  try {
    const [manifest, base] = await Promise.all([
      fetch(REGISTRY_URL).then(r => r.json()),
      fetch(IMPORT_MAP_URL).then(r => r.json())
    ]);
    const imports = { ...(base.imports || {}) };
    (manifest.modules || []).forEach(m => {
      imports[m.id] = m.entry;
    });
    Object.keys(imports).forEach(k => map.set(k, imports[k]));
  } catch (_) {
    try {
      const base = await fetch(IMPORT_MAP_URL).then(r => r.json());
      Object.keys(base.imports || {}).forEach(k => map.set(k, base.imports[k]));
    } catch (e) {
      map.clear();
    }
  }
  if (opts.useSW && 'serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/SP1RL_O-S-core/codex/_registry/deploy/sw.js');
    } catch (_) {}
  }
}

async function load(id) {
  const entry = map.get(id);
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

async function hotSwap(id, newEntry) {
  map.set(id, newEntry);
  delete cache[id];
  return load(id);
}

function unload(id) {
  delete cache[id];
}

async function require(ids) {
  const mods = {};
  for (const id of ids) {
    mods[id] = await load(id);
  }
  emit({ type: 'sp1rl/modules-loaded', ids });
  return mods;
}

const SP1RL = { init, load, hotSwap, unload, require, map };
export default SP1RL;
