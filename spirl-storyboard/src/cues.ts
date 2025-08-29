import type { Storyboard, CueName } from "./schema";
import { zcmFromText, zcmScore } from "./zcm";
import { writeAutoReceipts } from "./ledger";
import { resolveSfx } from "./sfx";

export type TimelineEvent = { t: number; cue: CueName; data: any };

export function expand(board: Storyboard): { timeline: TimelineEvent[], receipts: any[] } {
  const timeline: TimelineEvent[] = [];
  const receipts: any[] = [];
  let t = 0;

  const push = (cue: CueName, data: any, dur: number, receipt?: any) => {
    timeline.push({ t, cue, data }); t += dur;
    if (receipt) receipts.push(receipt);
  };

  for (const c of board.cues) {
    switch (c.cue) {
      case "SCROLL_OPEN": {
        push("SCROLL_OPEN", c, 3.5); break;
      }
      case "COMMENTS_HOST": {
        const lines = c.comments.map((m, i) => {
          const z = zcmFromText(m.text);
          return { ...m, zcm: z, zcmScore: +zcmScore(z).toFixed(3), idx: i };
        });
        push("COMMENTS_HOST", { ...c, lines }, 2 + lines.length * 2);
        break;
      }
      case "MORPH_TRAINING": {
        // Dewey (line→sax) & Sophia (line→square→diamond→circle) sequence
        push("MORPH_TRAINING", c, 7.5); break;
      }
      case "REVEAL": {
        push("REVEAL", c, 4.0); break;
      }
      case "LEDGER_CHECK": {
        const rec = { ts: Date.now(), entry: c.ledger.entry, witness: c.ledger.witness, meta_id: board.meta.id };
        push("LEDGER_CHECK", c, 2.2, rec);
        break;
      }
      case "NFT_RAIN": {
        const drops = c.badges.map(b => {
          const z = zcmFromText(b.zcm_hint || b.desc || b.name);
          return { ...b, zcm: z, zcmScore: +zcmScore(z).toFixed(3) };
        });
        push("NFT_RAIN", { ...c, drops }, 2.8 + drops.length * 1.0, { ts: Date.now(), nft_rain: drops, meta_id: board.meta.id });
        break;
      }
      case "GUESS_PREVIEW": {
        // continuity breadcrumb: end-of-episode teaser
        const teaser = { ...c.teaser, meta_id: board.meta.id, title: board.meta.title };
        push("GUESS_PREVIEW", teaser, 2.5, { teaser });
        break;
      }
      case "AWARD_MFT": {
        // award: log receipt
        push("AWARD_MFT", c, 1.8, { mft: c.winner, meta_id: board.meta.id });
        break;
      }
      case "SFX": {
        const timelineSfx = resolveSfx(c.names);
        push("SFX", { names: c.names, resolved: timelineSfx }, 1.2);
        break;
      }
      case "OUTRO": {
        push("OUTRO", c, 2.5); break;
      }
    }
  }

  // write/return receipts (auto-ledger)
  writeAutoReceipts(board.meta.id, receipts);
  return { timeline, receipts };
}

