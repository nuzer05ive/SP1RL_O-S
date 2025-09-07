export interface Intent {
  moral: string;
  dilemma: string;
  stakes: string;
}

export interface HumaneConstraints {
  humane: boolean;
  moral: string;
  dilemma: string;
  stakes: string;
}

export interface Design {
  hats: string[];
  constraints: HumaneConstraints;
}

export interface TrialHat {
  name: string;
  pass: boolean;
  score?: number;
}

export interface Finalize {
  hats: TrialHat[];
  constraints: HumaneConstraints;
}

export interface PrimeAddress {
  hash: string;
}

export interface FinalCharacter {
  primeAddress: PrimeAddress;
  finish: string;
}
