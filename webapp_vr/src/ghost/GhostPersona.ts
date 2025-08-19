import { getAntonyms, biasMap } from "../state/AntonymStore";
import { zcmScore, receipt, phiAngle, WOBBLE } from "./GhostMath";
import { analyzeConstant, analyzeShard } from "../constants/SpiralConstants";
export type GhostReply = { text:string; receipts:any[]; local:any; global:any };
export function ghostAnswer(q:string, scope:{local:any; global:any}): GhostReply {
  const trimmed = q.trim();
  if (trimmed.startsWith("const")) {
    const arg = trimmed.slice(5).trim();
    const analysis = /^[-+0-9.]+$/.test(arg) && arg.match(/[0-9]/)
      ? analyzeConstant(parseFloat(arg))
      : analyzeShard(arg);
    return {
      text: JSON.stringify(analysis, null, 2),
      receipts: [receipt("const", analysis)],
      local: scope.local,
      global: scope.global
    };
  }

  const ants = getAntonyms(); const bias = biasMap();
  const z = ants.zcm; const zcm = zcmScore(z);
  // Style steer: short/pointed if playful/bold/novel positive; more measured if negatives dominate.
  const style = (bias.playful??0)+(bias.bold??0)+(bias.novel??0) - (Math.abs(bias.solemn??0)+Math.abs(bias.cautious??0));
  const spice = (bias.spicy??0);
  // “Answer” is Wizard‑of‑Oz: we derive tone + a math receipt showing how we’d have computed it.
  const base = `ZCM@.55 locked? ${zcm>0.9?"yes":"near"} · wobble ${WOBBLE} · φθ(k) for k∈{1..5}: `+
    Array.from({length:5},(_,i)=>phiAngle(i+1).toFixed(3)).join(", ");
  const quip = style>0.1 ? "Sharp blade, soft hands." : "Measured stride, clean lines.";
  const zing = spice>0.15 ? " (with a kick)" : "";
  const text = `${quip}${zing} → ${base}\nQ: ${q}`;
  return {
    text,
    receipts:[
      receipt("antonym-bias", bias),
      receipt("zcm", { z, zcm }),
      receipt("phi", { wobble: WOBBLE })
    ],
    local: scope.local, global: scope.global
  };
}
