import type { Storyboard, CueName } from "./schema";
import { zcmFromText, zcmScore } from "./zcm";

export type TimelineEvent = {
  t: number;                   // time offset (sec) - naive linear for now
  cue: CueName;
  data: any;
};

export function expand(board: Storyboard): { timeline: TimelineEvent[], receipts: any[] } {
  const timeline: TimelineEvent[] = [];
  const receipts: any[] = [];
  let t = 0;

  for (const c of board.cues) {
    switch (c.cue) {
      case "SCROLL_OPEN": {
        timeline.push({ t, cue: "SCROLL_OPEN", data: c });
        t += 3.5;
        break;
      }
      case "COMMENTS_HOST": {
        // compute per-comment ZCM & sass
        const lines = c.comments.map((m, i) => {
          const z = zcmFromText(m.text);
          return { ...m, zcm: z, zcmScore: +zcmScore(z).toFixed(3), idx: i };
        });
        timeline.push({ t, cue: "COMMENTS_HOST", data: { ...c, lines } });
        t += 6 + lines.length * 2;
        break;
      }
      case "TRAINING": {
        timeline.push({ t, cue: "TRAINING", data: c });
        t += 7;
        break;
      }
      case "REVEAL": {
        timeline.push({ t, cue: "REVEAL", data: c });
        t += 4;
        break;
      }
      case "LEDGER_CHECK": {
        // ledger “receipt”
        receipts.push({ ts: Date.now(), entry: c.ledger.entry, witness: c.ledger.witness });
        timeline.push({ t, cue: "LEDGER_CHECK", data: c });
        t += 2.5;
        break;
      }
      case "NFT_RAIN": {
        // compute badge previews from zcm_hint
        const drops = c.badges.map(b => {
          const z = zcmFromText(b.zcm_hint || b.desc || b.name);
          return { ...b, zcm: z, zcmScore: +zcmScore(z).toFixed(3) };
        });
        timeline.push({ t, cue: "NFT_RAIN", data: { ...c, drops } });
        receipts.push({ ts: Date.now(), nft_rain: drops });
        t += 3 + drops.length * 1.2;
        break;
      }
      case "OUTRO": {
        timeline.push({ t, cue: "OUTRO", data: c });
        t += 2.5;
        break;
      }
    }
  }
  return { timeline, receipts };
}
