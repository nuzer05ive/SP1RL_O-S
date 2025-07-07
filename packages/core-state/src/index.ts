// MONDAY 🌹👁🌀
// core-state: zustand store

import create from 'zustand';
import { LAP_SIZE, TICK_MS } from '@sp1rl/core-math';

export interface SpiralSlice {
  node: number;
  lap: number;
  theta: number;
  history: Array<{node:number;lap:number;theta:number}>;
  tick: () => void;
}

export const useSpiralState = create<SpiralSlice>((set, get) => ({
  node: 0,
  lap: 0,
  theta: 0,
  history: [],
  tick: () => {
    const { node, lap, history } = get();
    const nextNode = (node + 1) % LAP_SIZE;
    const nextLap = nextNode === 0 ? lap + 1 : lap;
    const theta = nextNode / LAP_SIZE;
    const entry = { node: nextNode, lap: nextLap, theta };
    const nextHistory = [...history.slice(-2047), entry];
    set({ node: nextNode, lap: nextLap, theta, history: nextHistory });
  }
}));

export const useNode = () => useSpiralState(s => s.node);
export const useTheta = () => useSpiralState(s => s.theta);
export const useLap = () => useSpiralState(s => s.lap);

setInterval(() => {
  useSpiralState.getState().tick();
}, TICK_MS);
