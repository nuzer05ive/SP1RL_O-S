export type PMBPayload = {
  id: string; version: "v1";
  world: 2|3; phiTiltIndex: number;
  alphaDeg: number; epsilon: number;
  thetaPrimeKappa: number;
  kazerov?: { enabled: boolean; N: number; pq: [number,number]; dutyBase: number; eta: number; sigmaDeg: number };
  music?: { scoreCsv: string; wav: string; paletteBias: Record<string,number> };
  glyph: { type: string; caption: string; string?: string };
  pmb?: { ecc: string; tileSize: number; rings: number; diamond: string; primeRibbon: boolean };
};

// Produce a deterministic "PNG-like" buffer with receipt text.
// (Renderer TODO: replace with real barcode draw later.)
export function pmbEncodeStub(payload: PMBPayload): Buffer {
  const small = {
    id: payload.id, world: payload.world, alphaDeg: payload.alphaDeg,
    eps: payload.epsilon, kappa: payload.thetaPrimeKappa, phiTilt: payload.phiTiltIndex
  };
  const stamp = JSON.stringify(small);
  return Buffer.from(`PNG_STUB_${stamp}`); // served as image/png by API
}

export function pmbDecodeStub(img: Buffer): PMBPayload {
  const s = img.toString("utf8");
  const j = s.slice(s.indexOf("{"));
  // Caller merges with panel defaults to reconstruct full payload.
  return JSON.parse(j) as PMBPayload;
}
