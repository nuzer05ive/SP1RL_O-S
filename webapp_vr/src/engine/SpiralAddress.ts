export type Params = {
  kappa:number; phiTilt:number;
  care:number; courage:number; trust:number;
  primeIndex:number; epoch:number; seedHash:number;
  microStep:number; // counts 0.000437-rad steps
};

const GOLDEN = (1+Math.sqrt(5))/2;
const DTH = 0.000437;

export function encode(p:Params):string {
  // pack as JSON -> Uint8Array -> base64url with checksum
  const payload = JSON.stringify(p);
  const bytes   = new TextEncoder().encode(payload);
  let sum = 0; for (const b of bytes) sum = (sum + b) % 9973;
  const tag = (p.primeIndex*31 + p.epoch*7 + sum) % 104729;
  return btoa(String.fromCharCode(...bytes)) + "." + tag.toString(36);
}

export function decode(addr:string):Params {
  const [b64, tag] = addr.split(".");
  const bytes = Uint8Array.from(atob(b64), c=>c.charCodeAt(0));
  const payload = JSON.parse(new TextDecoder().decode(bytes));
  // simple checksum verify (same as encode)
  let sum = 0; for (const b of bytes) sum = (sum + b) % 9973;
  const check = (payload.primeIndex*31 + payload.epoch*7 + sum) % 104729;
  if (check.toString(36) !== tag) throw new Error("Address checksum fail");
  return payload;
}

export { GOLDEN, DTH };
