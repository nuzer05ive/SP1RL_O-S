import { createHmac } from 'crypto';

export const PHI = (1 + Math.sqrt(5)) / 2;

export function hmac(seed: string, data: string): string {
  return createHmac('sha256', seed).update(data).digest('hex');
}
