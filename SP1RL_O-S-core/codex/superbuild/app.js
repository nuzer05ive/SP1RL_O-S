import { } from './mod/teal_ng.v1.js'; // Auto‑TEAL planner integration

let cfg = {};
let worker = null;
let auto = false;

async function init() {
  cfg = await loadConfig();
  try {
    worker = new Worker('mod/teal_ng.worker.js', { type: 'module' });
  } catch (err) {
    console.warn('Worker failed, falling back to main thread', err);
  }
  document.getElementById('plan-btn').addEventListener('click', planNow);
  document.getElementById('auto-teal').addEventListener('change', (e) => {
    auto = e.target.checked;
  });
  document.getElementById('settings-btn').addEventListener('click', openSettings);
  document.getElementById('close-settings').addEventListener('click', closeSettings);
  document.getElementById('save-settings').addEventListener('click', saveSettings);
  window.SP1RL_TEALNG = { planNow };
}

async function loadConfig() {
  const res = await fetch('config/teal_ng_config.json');
  const base = await res.json();
  const overrides = JSON.parse(localStorage.getItem('tealng_overrides') || '{}');
  return Object.assign({}, base, overrides);
}

function defaultState() {
  return {
    d2: [0],
    d3: [0],
    rings: { outer: 0, mid: 0, inner: 0 },
    kappa: 0,
    time: 0
  };
}

function defaultRegistry() {
  return { modules: { mod1: {}, mod2: {}, mod3: {} } };
}

function applySuggestion(res) {
  document.querySelectorAll('.card').forEach((c) => c.classList.remove('suggested'));
  const action = res.action || {};
  const card = document.querySelector(`.card[data-module="${action.moduleId}"]`);
  if (card) {
    card.classList.add('suggested');
    const r = res.rationale || {};
    card.title = `TEAL ${r.teal?.toFixed?.(2)} | ZCM ${r.zcm?.toFixed?.(2)} | 3BP ${r.threeBP?.toFixed?.(2)}`;
  }
}

async function planNow() {
  const state = window.currentState || defaultState();
  const registry = window.moduleRegistry || defaultRegistry();
  if (worker) {
    const suggestion = await new Promise((resolve, reject) => {
      const listener = (e) => {
        worker.removeEventListener('message', listener);
        if (e.data.ok) resolve(e.data.suggestion);
        else reject(e.data.error);
      };
      worker.addEventListener('message', listener);
      worker.postMessage({ cmd: 'plan', state, registry, cfg });
    });
    applySuggestion(suggestion);
  } else {
    const mod = await import('./mod/teal_ng.v1.js');
    const suggestion = await mod.planNext(state, registry, cfg);
    applySuggestion(suggestion);
  }
}

function openSettings() {
  const m = document.getElementById('settings-modal');
  m.classList.remove('hidden');
  document.getElementById('w-teal').value = cfg.weights?.teal ?? 0;
  document.getElementById('w-zcm').value = cfg.weights?.zcm ?? 0;
  document.getElementById('w-3bp').value = cfg.weights?.threeBP ?? 0;
  document.getElementById('w-jerk').value = cfg.weights?.jerkPenalty ?? 0;
  document.getElementById('w-novelty').value = cfg.weights?.novelty ?? 0;
  document.getElementById('branching').value = cfg.search?.branching ?? 0;
  document.getElementById('depth').value = cfg.search?.depth ?? 0;
  document.getElementById('dtms').value = cfg.search?.dtMs ?? 0;
  document.getElementById('calmz').value = cfg.window?.calmZ ?? 0;
}

function closeSettings() {
  document.getElementById('settings-modal').classList.add('hidden');
}

function saveSettings() {
  cfg.weights = cfg.weights || {};
  cfg.weights.teal = parseFloat(document.getElementById('w-teal').value);
  cfg.weights.zcm = parseFloat(document.getElementById('w-zcm').value);
  cfg.weights.threeBP = parseFloat(document.getElementById('w-3bp').value);
  cfg.weights.jerkPenalty = parseFloat(document.getElementById('w-jerk').value);
  cfg.weights.novelty = parseFloat(document.getElementById('w-novelty').value);
  cfg.search.branching = parseInt(document.getElementById('branching').value, 10);
  cfg.search.depth = parseInt(document.getElementById('depth').value, 10);
  cfg.search.dtMs = parseInt(document.getElementById('dtms').value, 10);
  cfg.window.calmZ = parseFloat(document.getElementById('calmz').value);
  localStorage.setItem('tealng_overrides', JSON.stringify(cfg));
  closeSettings();
}

document.addEventListener('fire', () => {
  if (auto) planNow();
});

init();
