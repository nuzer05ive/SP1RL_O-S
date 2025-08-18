import { } from './mod/teal_ng.v1.js'; // Auto‑TEAL planner integration
import { encode, toHuman, quantizeToPhi43, chooseWing, renderShardCard, decode } from './mod/prime_address.v1.js';
import { colorFor, decorateShard } from './mod/address_palette.v1.js';

let cfg = {};
let worker = null;
let auto = false;
let memAddrs = [];
const memPanel = () => document.getElementById('memPanel');

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
  document.body.addEventListener('click', handleActionButtons);
  hydrateMemory();
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

function applySuggestion(res, state) {
  document.querySelectorAll('.card').forEach((c) => {
    c.classList.remove('suggested');
    const pill = c.querySelector('.addr-pill');
    if (pill) pill.remove();
  });
  const action = res.action || {};
  const card = document.querySelector(`.card[data-module="${action.moduleId}"]`);
  if (card) {
    card.classList.add('suggested');
    const r = res.rationale || {};
    card.title = `TEAL ${r.teal?.toFixed?.(2)} | ZCM ${r.zcm?.toFixed?.(2)} | 3BP ${r.threeBP?.toFixed?.(2)}`;
    // prospective address pill
    const preview = res.preview || {};
    const { row, col } = quantizeToPhi43(preview.d2 || state.d2, preview.d3 || state.d3);
    const wing = chooseWing(preview.votes || state.witnessVotes || 0);
    const addr = { class: 'TP', p: 0, row, col, wing, k: 0, petal: 0, epoch: 0 };
    const pill = document.createElement('span');
    pill.className = 'addr-pill';
    pill.textContent = toHuman(addr);
    pill.style.cssText = 'display:inline-block;margin-top:4px;padding:2px 4px;font-size:10px;background:#eee;border-radius:4px;';
    pill.dataset.addr = toHuman(addr);
    card.appendChild(pill);
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
    applySuggestion(suggestion, state);
  } else {
    const mod = await import('./mod/teal_ng.v1.js');
    const suggestion = await mod.planNext(state, registry, cfg);
    applySuggestion(suggestion, state);
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
  const state = window.currentState || defaultState();
  const { row, col } = quantizeToPhi43(state.d2, state.d3);
  const wing = chooseWing(state.witnessVotes || 0);
  const addr = { class: 'TP', p: state.kappa || 0, q: 0, row, col, wing, k: state.kappa || 0, petal: state.rings?.outer || 0, epoch: state.time || 0 };
  const enc = encode(addr);
  const tick = { address: enc.human, address58: enc.b58 };
  window.lastTick = tick;
  memAddrs.push(enc.human);
  memAddrs = memAddrs.slice(-20);
  localStorage.setItem('memAddrs', JSON.stringify(memAddrs));
  appendShard(addr);
});

init();

function handleActionButtons(e) {
  const card = e.target.closest('.card');
  if (!card) return;
  if (e.target.classList.contains('copy-addr')) {
    const addr = card.dataset.addr || card.querySelector('.addr-pill')?.dataset.addr;
    const addr58 = card.dataset.addr58;
    const text = addr58 ? `${addr}\n${addr58}` : addr;
    if (addr) navigator.clipboard.writeText(text);
  }
  if (e.target.classList.contains('rebuild-addr')) {
    const addrStr = card.dataset.addr || card.querySelector('.addr-pill')?.dataset.addr;
    if (addrStr) {
      const obj = decode(addrStr).obj;
      renderShardCard(card, obj);
      decorateShard(card.querySelector('.shard.card'), obj);
      card.dataset.addr = addrStr;
    }
  }
}

function appendShard(addr) {
  const cont = document.createElement('div');
  renderShardCard(cont, addr);
  const card = cont.firstElementChild;
  decorateShard(card, addr);
  card.dataset.addr = toHuman(addr);
  const btns = document.createElement('div');
  btns.style.cssText = 'display:flex;gap:4px;margin-top:4px;';
  const copyB = document.createElement('button');
  copyB.className = 'copy-addr';
  copyB.textContent = 'Copy Addr';
  const rebB = document.createElement('button');
  rebB.className = 'rebuild-addr';
  rebB.textContent = 'Rebuild';
  btns.append(copyB, rebB);
  card.appendChild(btns);
  memPanel().prepend(card);
}

function hydrateMemory() {
  memAddrs = JSON.parse(localStorage.getItem('memAddrs') || '[]');
  memAddrs.forEach((h) => {
    try { appendShard(decode(h).obj); } catch (e) {}
  });
}
