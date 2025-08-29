#!/usr/bin/env node
import fs from "node:fs";
import { parseYaml } from "./schema";
import { expand } from "./cues";
import { renderHTML } from "./render";

function usage(){ console.log("usage: node dist/index.js <lint|expand|html> <file.yml> [out.json|out.html]"); }

async function main(){
  const [,,cmd, file, out] = process.argv;
  if (!cmd || !file) return usage();
  const yml = fs.readFileSync(file, "utf-8");
  const board = parseYaml(yml);
  if (cmd==="lint"){ console.log("OK:", board.meta.title); return; }
  const { timeline, receipts } = expand(board);
  if (cmd==="expand"){
    const json = JSON.stringify({ meta: board.meta, timeline, receipts }, null, 2);
    if (out) fs.writeFileSync(out, json); else console.log(json);
    return;
  }
  if (cmd==="html"){
    const html = renderHTML(board.meta.title, timeline);
    if (out) fs.writeFileSync(out, html); else console.log(html);
    return;
  }
  usage();
}
main().catch(e=>{ console.error(e); process.exit(1); });
