import { create } from 'zustand';

export type GhostConsoleState = {
  inputs: {
    seedText?: string;
    antonyms: { key: string; value: number }[];
    autoFromText: boolean;
    stress: { entropy: number; novelty: number; urgency: number };
  };
  zcm: { care: number; courage: number; trust: number };
  teal: { score: number; soft: number; hard: number };
  witness: { arm: 1|2|3|4|5; rotationEnabled: boolean; allowed: Set<1|2|3|4|5> };
  wobble: { step: number; angle: number; scale: number };
  epoch: { index: number; lastPrime?: number; sealed: boolean };
  policy: {
    sarcasm: { mode:'off'|'safety'|'strict'; perMinute:number };
    zcmToMath: { p:number; alpha_b:number; alpha_o:number; autoTighten:boolean };
  };
  lastAddress?: string;
  log: TickLogEntry[];
};

export type TickLogEntry = {
  t: number;
  angle: number;
  address: string;
  zcm: { care: number; courage: number; trust: number };
  teal: number;
  witness: 1|2|3|4|5;
  epoch: number;
  sealed: boolean;
  meta?: { note?: string; seedTextHash?: string };
};

const initialState: GhostConsoleState = {
  inputs: {
    antonyms: [],
    autoFromText: false,
    stress: { entropy: 0, novelty: 0, urgency: 0 }
  },
  zcm: { care: 0, courage: 0, trust: 0 },
  teal: { score: 0, soft: 0.62, hard: 0.72 },
  witness: { arm: 5, rotationEnabled: false, allowed: new Set([1,2,3,4,5]) },
  wobble: { step: 0, angle: 0, scale: 1 },
  epoch: { index: 0, sealed: false },
  policy: {
    sarcasm: { mode: 'off', perMinute: 0 },
    zcmToMath: { p: 0.333, alpha_b: 1, alpha_o: 1, autoTighten: false }
  },
  log: []
};

export const useGhostConsole = create<GhostConsoleState>(() => ({...initialState}));

export function resetConsole() {
  useGhostConsole.setState({ ...initialState });
}
