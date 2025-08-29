import yaml from "js-yaml";

export type CueName =
  | "SCROLL_OPEN" | "COMMENTS_HOST" | "MORPH_TRAINING" | "REVEAL"
  | "LEDGER_CHECK" | "NFT_RAIN" | "OUTRO"
  | "GUESS_PREVIEW" | "AWARD_MFT" | "SFX";

export type CommentLine = { by: "greg"|"viewer"|"npc"; text: string; user?: string };

export interface Storyboard {
  meta: {
    id: string; title: string; episode: string; date: string;
    cast: string[]; // ["Kap","Greg","Dewey","Sophia",".Q"]
    prev_id?: string;           // continuity pointer
  };
  cues: Array<
    | { cue: "SCROLL_OPEN"; vo: string; bg?: string }
    | { cue: "COMMENTS_HOST"; host: "Greg"; comments: CommentLine[]; riff?: string }
    | { cue: "MORPH_TRAINING"; dewey_track: string; sophia_track: string; sequence: string[] }
    | { cue: "REVEAL"; forms: string[]; bridge?: string; typewriter: string[] }
    | { cue: "LEDGER_CHECK"; ledger: { entry: string; witness: string } }
    | { cue: "NFT_RAIN"; badges: Array<{name:string; desc:string; zcm_hint?:string}>; sparkle?: string }
    | { cue: "GUESS_PREVIEW"; teaser: { silhouette: string; hint: string; tease_id: string } }
    | { cue: "AWARD_MFT"; winner: { user: string; guess: string; award: string } }
    | { cue: "SFX"; names: string[] }
    | { cue: "OUTRO"; cta: string; confetti?: boolean }
  >;
}

export function parseYaml(yml: string): Storyboard {
  const obj = yaml.load(yml) as any;
  if (!obj?.meta?.id || !obj?.meta?.title || !Array.isArray(obj?.cues)) {
    throw new Error("Invalid storyboard: missing meta.id/meta.title/cues[]");
  }
  for (const c of obj.cues) {
    if (!c?.cue) throw new Error("Cue missing 'cue'");
  }
  return obj as Storyboard;
}

