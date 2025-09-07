export function cloneCost(E: number, S: number, B: number, R: number, N: number, params = {lambda:1, beta:1, eta:1, gamma:1, nu:1}): number {
  const {lambda, beta, eta, gamma, nu} = params;
  const L = lambda*E + beta*S - eta*B + gamma*R - nu*N;
  return Math.max(0, Math.min(1, L));
}
