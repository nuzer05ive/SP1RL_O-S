export type Chem = { S: number; D: number; C: number };

export type ReactorState = {
  phiS: number;
  phiK: number;
  delta: number;
  thrust: number;
  coat: [number, number, number, number];
  tauBandit: number;
  kappaPLL: number;
  R: number;
  H: number;
  yFork: boolean;
};

function lcg(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) % 0xffffffff;
    return s / 0xffffffff;
  };
}

export function stepCoupledPhases(
  phiS: number,
  phiK: number,
  params: {
    wS: number;
    wK: number;
    K: number;
    noiseS?: number;
    noiseK?: number;
    seed: number;
  }
): { phiS: number; phiK: number; delta: number; thrust: number } {
  const rand = lcg(params.seed);
  const nS = (rand() * 2 - 1) * (params.noiseS ?? 0);
  const nK = (rand() * 2 - 1) * (params.noiseK ?? 0);
  const nextPhiS =
    phiS + params.wS + params.K * Math.sin(phiK - phiS) + nS;
  const nextPhiK =
    phiK + params.wK + params.K * Math.sin(phiS - phiK) + nK;
  const delta = nextPhiK - nextPhiS;
  const thrust = Math.sin(delta);
  return { phiS: nextPhiS, phiK: nextPhiK, delta, thrust };
}

export function chemToControls(
  h: Chem,
  base: {
    tau0: number;
    kappa0: number;
    betaS: number;
    betaD: number;
    betaC: number;
    gammaS: number;
    gammaC: number;
  }
): { coat: [number, number, number, number]; tauBandit: number; kappaPLL: number } {
  const g = 0.25 + 0.2 * h.S;
  const r = 0.25 + 0.4 * h.C;
  const b = 0.25 + 0.2 * h.S;
  const s = 0.25 + 0.5 * h.D;
  const total = g + r + b + s;
  const coat: [number, number, number, number] = [
    g / total,
    r / total,
    b / total,
    s / total,
  ];
  const tauBandit =
    base.tau0 * Math.exp(base.betaD * h.D - base.betaS * h.S + base.betaC * h.C);
  const kappaPLL =
    base.kappa0 * (1 + base.gammaS * h.S - base.gammaC * h.C);
  return { coat, tauBandit, kappaPLL };
}

export function residueUpdate(
  _prevR: number,
  features: { compRatio: number; mi: number; windowHitDensity: number },
  w: { w1: number; w2: number; w3: number }
): { R: number; H: number } {
  const raw =
    w.w1 * features.compRatio +
    w.w2 * features.mi +
    w.w3 * features.windowHitDensity;
  const R = Math.min(1, Math.max(0, raw));
  const H = 1 - R;
  return { R, H };
}

export function shouldSpawnY(
  thrust: number,
  H: number,
  hist: { thrustMin: number; HMin: number; beatsAbove: number; requiredBeats: number }
): boolean {
  if (Math.abs(thrust) >= hist.thrustMin && H >= hist.HMin) {
    return hist.beatsAbove + 1 >= hist.requiredBeats;
  }
  return false;
}

export function stepReactor(
  prev: { phiS: number; phiK: number; R: number },
  chem: Chem,
  env: {
    wS: number;
    wK: number;
    K: number;
    tau0: number;
    kappa0: number;
    betaS: number;
    betaD: number;
    betaC: number;
    gammaS: number;
    gammaC: number;
    thrustMin: number;
    HMin: number;
    beatsAbove: number;
    requiredBeats: number;
    seed: number;
  },
  feats: { compRatio: number; mi: number; windowHitDensity: number }
): ReactorState {
  const phase = stepCoupledPhases(prev.phiS, prev.phiK, {
    wS: env.wS,
    wK: env.wK,
    K: env.K,
    seed: env.seed,
  });
  const controls = chemToControls(chem, {
    tau0: env.tau0,
    kappa0: env.kappa0,
    betaS: env.betaS,
    betaD: env.betaD,
    betaC: env.betaC,
    gammaS: env.gammaS,
    gammaC: env.gammaC,
  });
  const residue = residueUpdate(prev.R, feats, {
    w1: 1 / 3,
    w2: 1 / 3,
    w3: 1 / 3,
  });
  const yFork = shouldSpawnY(phase.thrust, residue.H, {
    thrustMin: env.thrustMin,
    HMin: env.HMin,
    beatsAbove: env.beatsAbove,
    requiredBeats: env.requiredBeats,
  });
  return {
    phiS: phase.phiS,
    phiK: phase.phiK,
    delta: phase.delta,
    thrust: phase.thrust,
    coat: controls.coat,
    tauBandit: controls.tauBandit,
    kappaPLL: controls.kappaPLL,
    R: residue.R,
    H: residue.H,
    yFork,
  };
}
