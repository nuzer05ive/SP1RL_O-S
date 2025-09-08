import { describe, it, expect } from 'vitest';
import {
  stepCoupledPhases,
  chemToControls,
  shouldSpawnY,
  stepReactor,
  type Chem,
} from '@vishnu/core/reactorMath';

const run = process.env.RUN_ONLINE === '1' ? it : it.skip;

describe('reactor math', () => {
  run('thrust zeros and peak', () => {
    const z0 = stepCoupledPhases(0, 0, { wS: 0, wK: 0, K: 0, seed: 1 });
    const zpi = stepCoupledPhases(0, Math.PI, { wS: 0, wK: 0, K: 0, seed: 1 });
    const phi = stepCoupledPhases(0, (2 * Math.PI) / ((1 + Math.sqrt(5)) / 2), {
      wS: 0,
      wK: 0,
      K: 0,
      seed: 1,
    });
    expect(Math.abs(z0.thrust)).toBeLessThan(1e-6);
    expect(Math.abs(zpi.thrust)).toBeLessThan(1e-6);
    expect(Math.abs(phi.thrust)).toBeGreaterThan(Math.abs(z0.thrust));
    expect(Math.abs(phi.thrust)).toBeGreaterThan(Math.abs(zpi.thrust));
  });

  run('chemistry monotonicity', () => {
    const base = {
      tau0: 1,
      kappa0: 1,
      betaS: 1,
      betaD: 1,
      betaC: 1,
      gammaS: 1,
      gammaC: 1,
    };
    const lowC: Chem = { S: 0, D: 0, C: 0 };
    const highC: Chem = { S: 0, D: 0, C: 1 };
    const lowS: Chem = { S: 0, D: 0, C: 0 };
    const highS: Chem = { S: 1, D: 0, C: 0 };
    const lowD: Chem = { S: 0, D: 0, C: 0 };
    const highD: Chem = { S: 0, D: 1, C: 0 };
    const ccLow = chemToControls(lowC, base);
    const ccHigh = chemToControls(highC, base);
    expect(ccHigh.coat[1]).toBeGreaterThan(ccLow.coat[1]);
    expect(ccHigh.tauBandit).toBeGreaterThan(ccLow.tauBandit);
    const csLow = chemToControls(lowS, base);
    const csHigh = chemToControls(highS, base);
    expect(csHigh.coat[0]).toBeGreaterThan(csLow.coat[0]);
    expect(csHigh.coat[2]).toBeGreaterThan(csLow.coat[2]);
    expect(csHigh.kappaPLL).toBeGreaterThan(csLow.kappaPLL);
    const cdLow = chemToControls(lowD, base);
    const cdHigh = chemToControls(highD, base);
    expect(cdHigh.coat[3]).toBeGreaterThan(cdLow.coat[3]);
    expect(cdHigh.tauBandit).toBeGreaterThan(cdLow.tauBandit);
  });

  run('PLL stabilization', () => {
    const base = {
      tau0: 1,
      kappa0: 1,
      betaS: 1,
      betaD: 1,
      betaC: 1,
      gammaS: 1,
      gammaC: 1,
    };
    const sHigh: Chem = { S: 1, D: 0, C: 0 };
    const cHigh: Chem = { S: 0, D: 0, C: 1 };
    const ks = chemToControls(sHigh, base);
    const kc = chemToControls(cHigh, base);
    expect(ks.kappaPLL).toBeGreaterThan(kc.kappaPLL);
  });

  run('Y-fork trigger', () => {
    let beats = 0;
    let prev = { phiS: 0, phiK: 1.119, R: 0 };
    for (let i = 0; i < 13; i++) {
      const state = stepReactor(
        prev,
        { S: 0, D: 0, C: 0 },
        {
          wS: 0,
          wK: 0,
          K: 0,
          tau0: 1,
          kappa0: 1,
          betaS: 1,
          betaD: 1,
          betaC: 1,
          gammaS: 1,
          gammaC: 1,
          thrustMin: 0.7,
          HMin: 0.95,
          beatsAbove: beats,
          requiredBeats: 13,
          seed: 1,
        },
        { compRatio: 0, mi: 0, windowHitDensity: 0 }
      );
      if (Math.abs(state.thrust) >= 0.7 && state.H >= 0.95) {
        beats++;
      } else {
        beats = 0;
      }
      prev = { phiS: state.phiS, phiK: state.phiK, R: state.R };
      if (state.yFork) {
        expect(state.yFork).toBe(true);
        return;
      }
    }
    expect(false).toBe(true);
  });
});
