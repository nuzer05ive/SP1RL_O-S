export interface ScenePatch {
  [key: string]: unknown;
}

export interface WitnessState {
  drift: number;
}

export interface FoldSpec {
  hinge?: number;
  slider?: number;
  string?: number;
  accordion?: number;
}

export interface WalEvent {
  id: string;
  t: string;
  type: string;
  scene_id: string;
  user_id: string;
  req_id: string;
  model_semver: string;
  kernel_digest: string;
  payload: Record<string, unknown>;
  status: 'OK' | 'FAILED';
}
