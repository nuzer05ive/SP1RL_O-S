import fs from "node:fs";
import path from "node:path";

const LEDGER_DIR = "out/ledger"; // text-only receipts live here

export function writeAutoReceipts(metaId: string, receipts: any[]){
  try { fs.mkdirSync(LEDGER_DIR, { recursive: true }); } catch {}
  const p = path.join(LEDGER_DIR, `${sanitize(metaId)}.jsonl`);
  const lines = receipts.map(r => JSON.stringify(r));
  fs.appendFileSync(p, lines.join("\n") + "\n");
}

function sanitize(s: string){ return s.replace(/[^A-Za-z0-9._-]/g, "_"); }

export function aggregateLedger(): any[] {
  try {
    const files = fs.readdirSync(LEDGER_DIR).filter(f => f.endsWith(".jsonl"));
    const all: any[] = [];
    for (const f of files){
      const text = fs.readFileSync(path.join(LEDGER_DIR, f), "utf-8");
      for (const line of text.split("\n")){
        if (!line.trim()) continue;
        try { all.push(JSON.parse(line)); } catch {}
      }
    }
    // sort by timestamp
    all.sort((a,b)=> (a.ts||0) - (b.ts||0));
    return all;
  } catch { return []; }
}

