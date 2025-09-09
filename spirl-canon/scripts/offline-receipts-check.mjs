import { DELTA_2_DEG, DELTA_3_DEG, thetaPrime, phiTilt } from '../packages/core/src/phi.js';
console.log('[receipts]', {
  DELTA_2_DEG, DELTA_3_DEG,
  thetaPrime: thetaPrime().toExponential(6),
  phiTilt123: phiTilt(123).toFixed(1)
});
