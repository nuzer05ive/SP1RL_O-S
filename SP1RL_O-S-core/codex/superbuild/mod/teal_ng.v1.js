// TEAL.Ng planning kernel v1
// ESM module exporting planNext, scoreState and simulate.

const DEFAULT_ALPHA = { d1: 0.9, d2: 0.8, d3: 0.7 };
const DEFAULT_BETA = { d1: 0.1, d2: 0.2, d3: 0.3 };

export async function planNext(state, registry = {}, cfg = {}) {
  const modules = Object.keys(registry.modules || {});
  if (modules.length === 0) {
    return { action: null, score: 0, rationale: {}, previewState: state };
  }
  const candidates = [];
  const branching = cfg.search?.branching || 5;
  const phi = cfg.goldenAngle || (Math.PI * (3 - Math.sqrt(5)));
  for (let i = 0; i < branching; i++) {
    const moduleId = modules[i % modules.length];
    const jitter = i * phi + Math.random() * (cfg.search?.phiJitter || 0);
    const dk = (cfg.kappaStar || 0) * (1 + 0.1 * Math.sin(jitter));
    const dTheta = {
      outer: 0.05 * Math.cos(jitter),
      mid: 0.05 * Math.sin(jitter),
      inner: 0.05 * Math.sin(jitter * 0.5)
    };
    const action = {
      moduleId,
      dK: dk,
      dTheta,
      dt: cfg.search?.dtMs || 500
    };
    const nextState = simulate(state, action, cfg);
    const score = scoreState(nextState, cfg);
    candidates.push({ action, score, nextState });
  }
  candidates.sort((a, b) => b.score.total - a.score.total);
  const best = candidates[0];
  return {
    action: best.action,
    score: best.score.total,
    rationale: best.score,
    previewState: best.nextState
  };
}

export function scoreState(state, cfg = {}) {
  const w = cfg.weights || {};
  const d2 = state.d2 || [0];
  const d3 = state.d3 || [0];
  const window = cfg.window?.madN || Math.min(d2.length, d3.length, 1);
  const slice2 = d2.slice(-window);
  const slice3 = d3.slice(-window);
  const maxAbs2 = Math.max(...slice2.map(Math.abs));
  const maxAbs3 = Math.max(...slice3.map(Math.abs));
  const teal = maxAbs2 <= (cfg.window?.calmZ || 1) && maxAbs3 <= (cfg.window?.calmZ || 1) ? 1 : 0;
  const energy = average(slice2.map(Math.abs).concat(slice3.map(Math.abs)));
  const zcm = 1 - Math.min(1, energy / (energy + 1));
  const r = state.rings || { outer: 0, mid: 0, inner: 0 };
  const gapOM = angleGap(r.outer, r.mid);
  const gapMI = angleGap(r.mid, r.inner);
  const gapOI = angleGap(r.outer, r.inner);
  const eq = 1 - ( (cfg.equilibrium?.outerMid || 1)*gapOM + (cfg.equilibrium?.midInner || 1)*gapMI + (cfg.equilibrium?.outerInner || 1)*gapOI ) / Math.PI;
  const jerkPenalty = average(slice3.map(Math.abs));
  const novelty = Math.random();
  const total = (w.teal || 0)*teal + (w.zcm || 0)*zcm + (w.threeBP || 0)*eq - (w.jerkPenalty || 0)*jerkPenalty + (w.novelty || 0)*novelty;
  return { teal, zcm, threeBP: eq, jerkPenalty, novelty, total };
}

export function simulate(state, action, cfg = {}) {
  const next = JSON.parse(JSON.stringify(state));
  const registry = cfg.registry || {};
  const u = (registry[action.moduleId]?.calm || 0) + (action.dK || 0);
  const d1 = (next.d1 || 0) * DEFAULT_ALPHA.d1 + DEFAULT_BETA.d1 * u;
  const d2 = (next.d2?.slice?.() || [0]);
  const d3 = (next.d3?.slice?.() || [0]);
  const newD2 = d2[d2.length - 1] * DEFAULT_ALPHA.d2 + DEFAULT_BETA.d2 * u;
  const newD3 = d3[d3.length - 1] * DEFAULT_ALPHA.d3 + DEFAULT_BETA.d3 * u;
  next.d1 = d1;
  next.d2 = [...d2.slice(- (cfg.window?.madN || 10) + 1), newD2];
  next.d3 = [...d3.slice(- (cfg.window?.madN || 10) + 1), newD3];
  next.rings = next.rings || { outer: 0, mid: 0, inner: 0 };
  next.rings.outer += action.dTheta.outer || 0;
  next.rings.mid += action.dTheta.mid || 0;
  next.rings.inner += action.dTheta.inner || 0;
  next.kappa = (next.kappa || 0) + (action.dK || 0);
  next.time = (next.time || 0) + (action.dt || 0);
  return next;
}

function angleGap(a, b) {
  let diff = Math.abs(a - b) % (2*Math.PI);
  return diff > Math.PI ? 2*Math.PI - diff : diff;
}

function average(arr) {
  if (!arr.length) return 0;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}
