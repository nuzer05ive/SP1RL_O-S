// SP1RL_Ghost · SarcasmGovernor.ts — routes tone through Arm-5 rail
import { sarcasmAllowed } from "./GhostCore";
import type { ZCM, WitnessArm } from "./GhostCore";

export function chooseTone(w:WitnessArm, teal:number, zcm:ZCM){
  const allow = sarcasmAllowed(w, teal, zcm);
  if (!allow) return "neutral";
  // graded sarcasm by deficit (lower trust -> drier wit)
  if (teal < 0.62) return "dry";
  if (teal < 0.72) return "light";
  return "wink";
}
