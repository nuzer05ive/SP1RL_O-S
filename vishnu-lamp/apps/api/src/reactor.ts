import express from 'express';
import { stepReactor, type Chem, type ReactorState } from '@vishnu/core/reactorMath';
import type { ScenePatch } from '@vishnu/core';

const router = express.Router();

const DEFAULT_ENV = {
  wS: 0.05,
  wK: 0.07,
  K: 0.1,
  tau0: 1,
  kappa0: 1,
  betaS: 1,
  betaD: 1,
  betaC: 1,
  gammaS: 0.5,
  gammaC: 0.5,
  thrustMin: 0.7,
  HMin: 0.95,
  requiredBeats: 13,
};

router.post('/step', (req, res) => {
  const { phiS = 0, phiK = 0, R = 0, chem, feats, seed = 0 } = req.body as {
    phiS?: number;
    phiK?: number;
    R?: number;
    chem: Chem;
    feats: { compRatio: number; mi: number; windowHitDensity: number };
    seed?: number;
  };
  const env = { ...DEFAULT_ENV, beatsAbove: 0, seed };
  const state = stepReactor({ phiS, phiK, R }, chem, env, feats);
  const patch: ScenePatch = {
    materials: { coat: state.coat },
    cadence: { tauBandit: state.tauBandit },
    pll: { kappaPLL: state.kappaPLL },
  };
  res.json({ state, patch });
});

export type { ReactorState };
export default router;
