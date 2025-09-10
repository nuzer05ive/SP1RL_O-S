import React from 'react';
import { decodePMB } from '../lib/pmb/decode';

export default function PMBScanner({ onLoad }: { onLoad: (p: any) => void }) {
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const buf = Buffer.from(await f.arrayBuffer());
    const p = decodePMB(buf);
    onLoad(p);
  };
  return <input type="file" accept="image/*" onChange={handleFile} />;
}
