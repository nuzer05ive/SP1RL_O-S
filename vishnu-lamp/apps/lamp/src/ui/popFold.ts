import { PHI, type FoldSpec } from '@vishnu/core';

const EPS = 1e-3;

function microDither(n: number): number {
  return ((n * PHI) % 1 - 0.5) * EPS;
}

export function hinge(theta: number): FoldSpec {
  return { hinge: theta + microDither(theta) };
}

export function slider(x: number): FoldSpec {
  return { slider: x + microDither(x) };
}

export function string(y: number): FoldSpec {
  return { string: y + microDither(y) };
}

export function accordion(open: number): FoldSpec {
  return { accordion: open + microDither(open) };
}

export function compose(...folds: FoldSpec[]): FoldSpec {
  return folds.reduce((acc, f) => ({ ...acc, ...f }), {} as FoldSpec);
}
