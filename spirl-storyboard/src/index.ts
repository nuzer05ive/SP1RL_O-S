#!/usr/bin/env node
import fs from "node:fs";
import { parseYaml } from "./schema";
import { expand } from "./cues";
import { renderHTML } from "./render";
import { aggregateLedger } from "./ledger";
import { buildNextEpisodeYaml } from "./continuity";

function usage(){
  console.log("usage:");
  console.log(" node dist/index.js lint <file.yml>");
  console.log(" node dist/index.js expand <file.yml> [out.json]");
  console.log(" node dist/index.js html <file.yml> [out.html]");
  console.log(" node dist/index.js ledger build [out.json]");
  console.log(" node dist/index.js chain next <prev.json> <out.yml>");
}

async function main(){
  const [,,cmd,a,b] = process.argv;
  if (!cmd) return usage();

  if (cmd==="lint"){
    const y=fs.readFileSync(a,"utf-8"); parseYaml(y); console.log("OK");
    return;
  }
  if (cmd==="expand"){
    const y=fs.readFileSync(a,"utf-8"); const board=parseYaml(y);
    const { timeline, receipts } = expand(board);
    const json = JSON.stringify({ meta: board.meta, timeline, receipts }, null, 2);
    if (b) fs.writeFileSync(b, json); else console.log(json);
    return;
  }
  if (cmd==="html"){
    const y=fs.readFileSync(a,"utf-8"); const board=parseYaml(y);
    const { timeline } = expand(board);
    const html = renderHTML(board.meta.title, timeline);
    if (b) fs.writeFileSync(b, html); else console.log(html);
    return;
  }
  if (cmd==="ledger" && a==="build"){
    const agg = aggregateLedger();
    const out = b || "out/ledger_aggregate.json";
    fs.mkdirSync("out", { recursive:true });
    fs.writeFileSync(out, JSON.stringify(agg,null,2));
    console.log("wrote", out);
    return;
  }
  if (cmd==="chain" && a==="next"){
    // previous teaser or expanded json input
    const prev = JSON.parse(fs.readFileSync(b,"utf-8"));
    const teaser = prev.teaser || prev.receipts?.find((r:any)=>r.teaser)?.teaser;
    if (!teaser) { console.error("no teaser found in input"); process.exit(1); }
    const nextMeta = {
      id: teaser.tease_id+"-EP",
      title: "Next Mystery",
      episode: "SxEy",
      date: new Date().toISOString().slice(0,10),
      cast: ["Kap","Greg","Dewey","Sophia",".Q"]
    };
    const yml = buildNextEpisodeYaml(teaser, nextMeta);
    const out = "out/next_episode.yml";
    fs.mkdirSync("out",{recursive:true}); fs.writeFileSync(out, yml);
    console.log("wrote", out);
    return;
  }
  usage();
}
main().catch(e=>{ console.error(e); process.exit(1); });

