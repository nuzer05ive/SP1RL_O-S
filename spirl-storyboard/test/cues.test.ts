import { parseYaml } from "../src/schema";
import { expand } from "../src/cues";

const Y = `
meta: { id: "ep-001", title: "Penguin Mug", episode: "S1E12", date: "2025-08-29", cast: [".Q","Greg","Kap","Dewey","Sophia"] }
cues:
  - cue: SCROLL_OPEN
    vo: "You only see the shadows…"
  - cue: COMMENTS_HOST
    host: "Greg"
    comments:
      - {by: viewer, text: "It’s a mug"}
      - {by: greg,   text: "Let me find out!!"}
  - cue: MORPH_TRAINING
    dewey_track: "SP1RL_Saxophone"
    sophia_track: "A-BLOOM_Line"
    sequence: ["dot→line","line→square","square→diamond","diamond→circle"]
  - cue: REVEAL
    forms: ["Mug","Handle","Penguin-bridge"]
    typewriter: ["Ledger: PENGUIN_MUG","Witness: .Q"]
  - cue: LEDGER_CHECK
    ledger: { entry: "PENGUIN_MUG", witness: ".Q" }
  - cue: SFX
    names: ["BELL_TOLL","SEAGULLS"]
  - cue: GUESS_PREVIEW
    teaser: { silhouette: "blob", hint: "mug", tease_id: "tease-001" }
  - cue: OUTRO
    cta: "Drop your guess!"
`;

describe("expand", () => {
  it("produces timeline and receipts for ledger & teaser", () => {
    const b = parseYaml(Y);
    const { timeline, receipts } = expand(b);
    expect(timeline.some(ev => ev.cue==="SFX")).toBe(true);
    expect(receipts.some(r=>r.entry==="PENGUIN_MUG")).toBe(true);
    expect(receipts.some(r=>r.teaser?.tease_id==="tease-001")).toBe(true);
  });
});

