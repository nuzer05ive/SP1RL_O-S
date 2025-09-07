import { hmac } from './Math';

export function windows(seed: string): string[] {
  const a = hmac(seed, 'a').slice(0, 8);
  const b = hmac(seed, 'b').slice(0, 8);
  return [a, b];
}
