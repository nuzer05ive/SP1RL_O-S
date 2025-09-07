export interface GhostSeed {
  id: string;
  shingles: string[];
}

export interface WeakLabels {
  [label: string]: number;
}

export interface BanditAction {
  arm: string;
  epsilon: number;
  reward: number;
}

export interface Cluster {
  id: string;
  seeds: string[];
}

export interface MintDecision {
  ok: boolean;
  m: number;
  reason?: string;
}

export interface MintReceipt {
  id: string;
  note?: string;
  decision: MintDecision;
}
