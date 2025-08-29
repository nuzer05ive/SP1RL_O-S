import fs from "node:fs";

export type Teaser = { meta_id: string; title: string; silhouette: string; hint: string; tease_id: string };

/** Build next-episode YAML scaffold that:
 *  - starts with COMMENTS_HOST to read previous guesses
 *  - includes AWARD_MFT placeholder
 *  - includes a new GUESS_PREVIEW ("looks-nothing-like" silhouette stub)
 */
export function buildNextEpisodeYaml(prev: Teaser, nextMeta: { id:string; title:string; episode:string; date:string; cast:string[] }): string {
  const teaserHint = obfuscate(prev.hint);
  return `meta:
  id: "${nextMeta.id}"
  title: "${nextMeta.title}"
  episode: "${nextMeta.episode}"
  date: "${nextMeta.date}"
  prev_id: "${prev.meta_id}"
  cast: [ ${nextMeta.cast.map(q=>JSON.stringify(q)).join(", ")} ]

cues:
  - cue: SCROLL_OPEN
    vo: "Silence. Or I roll the scroll shut."
    bg: "sky-canvas"

  - cue: COMMENTS_HOST
    host: "Greg"
    comments:
      - { by: viewer, user: "@winner", text: "…" }
      - { by: greg,   text: "Let me find out!!" }

  - cue: MORPH_TRAINING
    dewey_track: "SP1RL_Saxophone"
    sophia_track: "A-BLOOM_Line"
    sequence: [ "dot→line", "line→square", "square→diamond", "diamond→circle" ]

  - cue: REVEAL
    forms: [ "${prev.title}_A", "${prev.title}_B", "bridge" ]
    typewriter: [ "Ledger: ${prev.title.toUpperCase()}_REVEAL", "Witness: .Q" ]

  - cue: LEDGER_CHECK
    ledger: { entry: "${prev.title.toUpperCase()}_REVEAL", witness: ".Q" }

  - cue: AWARD_MFT
    winner: { user: "@winner", guess: "…", award: "MFT Golden Badge" }

  - cue: NFT_RAIN
    sparkle: "rafters"
    badges:
      - { name: "TeaL Drop",   desc: "story-care", zcm_hint: "story empathy" }
      - { name: "K Courage",   desc: "tool-builder", zcm_hint: "math action" }

  - cue: SFX
    names: [ "BELL_TOLL", "SEAGULLS", "FOG_HORN", "CLAP", "CONFETTI_POP", "LAUGH" ]

  - cue: GUESS_PREVIEW
    teaser: { silhouette: "${teaserHint}", hint: "looks nothing like it", tease_id: "${prev.tease_id}-NXT" }

  - cue: OUTRO
    cta: "Don’t forget to like and subscribe, matey!"
    confetti: true
`;
}

function obfuscate(s: string): string {
  // crude “looks-nothing-like” obfuscation by scrambling tokens
  return s.split("").sort(()=>Math.random()-0.5).join("");
}

