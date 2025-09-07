const RAD37_5 = (37.5 * Math.PI) / 180;

export function thetaPrime(kappa: number, omegaRood: number): number {
  return (kappa * RAD37_5 * omegaRood) / 385;
}

export function simulatePLL(kappa: number, loops: number): number {
  let driftSum = 0;
  const omega = 1; // normalized
  const H = 1;
  const tp = thetaPrime(kappa, omega);
  const omegaRood = tp * H;
  for (let i = 0; i < loops; i++) {
    driftSum += omegaRood - tp * H;
  }
  return driftSum;
}
