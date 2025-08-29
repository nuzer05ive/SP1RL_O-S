import yaml from "js-yaml";

export type CueName =
  | "SCROLL_OPEN" | "COMMENTS_HOST" | "TRAINING" | "REVEAL"
  | "LEDGER_CHECK" | "NFT_RAIN" | "OUTRO";

export type CommentLine = { by: "greg"|"viewer"|"npc"; text: string };

export interface Storyboard {
  meta: {
    id: string; title: string; episode: string; date: string;
    cast: string[]; // ["Kap","Greg","Dewey","Sophia",".Q"]
  };
  cues: Array<
    | { cue: "SCROLL_OPEN"; vo: string; bg?: string }
    | { cue: "COMMENTS_HOST"; host: "Greg"; comments: CommentLine[]; riff?: string }
    | { cue: "TRAINING"; track: string; morphs: string[]; interject?: string[] }
    | { cue: "REVEAL"; forms: string[]; bridge?: string; typewriter: string[] }
    | { cue: "LEDGER_CHECK"; ledger: { entry: string; witness: string } }
    | { cue: "NFT_RAIN"; badges: Array<{name:string; desc:string; zcm_hint?:string}>; sparkle?: string }
    | { cue: "OUTRO"; cta: string; confetti?: boolean }
  >;
}

export function parseYaml(yml: string): Storyboard {
  const obj = yaml.load(yml) as any;
  // minimal structural checks
  if (!obj?.meta?.id || !obj?.meta?.title || !Array.isArray(obj?.cues)) {
    throw new Error("Invalid storyboard: missing meta.id/meta.title/cues[]");
  }
  // Validate cue entries
  for (const c of obj.cues) {
    if (!c?.cue) throw new Error("Cue missing 'cue' field");
    const name = c.cue as CueName;
    if (!["SCROLL_OPEN","COMMENTS_HOST","TRAINING","REVEAL","LEDGER_CHECK","NFT_RAIN","OUTRO"].includes(name)) {
      throw new Error(`Unknown cue: ${name}`);
    }
  }
  return obj as Storyboard;
}
