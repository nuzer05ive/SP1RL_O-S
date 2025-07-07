import create from 'zustand';
import { LAP_SIZE } from '@sp1rl/core-math';

interface SpiralState {
  node: number;
  lap: number;
  tick: () => void;
}

export const useSpiralState = create<SpiralState>((set, get) => ({
  node: 0,
  lap: 0,
  tick: () => {
    const next = get().node + 1;
    set({
      node: next % LAP_SIZE,
      lap: next >= LAP_SIZE ? get().lap + 1 : get().lap
    });
  }
}));

export const useNode = () => useSpiralState(s => s.node);
export const useLap = () => useSpiralState(s => s.lap);
export const usePetal = () => useSpiralState(s => s.node % 3);
