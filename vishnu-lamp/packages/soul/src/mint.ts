import crypto from 'crypto';
import { MintDecision, MintReceipt } from './types';

export interface MintPayload {
  ai: boolean;
  su: boolean;
  note?: string;
  m: number;
  sceneHash: string;
  reqId: string;
}

export function mint(payload: MintPayload): {
  decision: MintDecision;
  receipt?: MintReceipt;
} {
  const decision: MintDecision = payload.ai && payload.su
    ? { ok: true, m: payload.m }
    : { ok: false, m: payload.m, reason: '.ai ∧ .su required' };
  if (!decision.ok) {
    return { decision };
  }
  const id = crypto
    .createHmac('sha256', payload.sceneHash)
    .update(payload.reqId)
    .digest('hex');
  const receipt: MintReceipt = { id, note: payload.note, decision };
  return { decision, receipt };
}
