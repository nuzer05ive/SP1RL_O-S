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
