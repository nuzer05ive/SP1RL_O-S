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
      - {by: viewer, text: "No, it’s the penguin!!"}
      - {by: greg,   text: "Let me find out!!"}
  - cue: TRAINING
    track: "Dewey riff"
    morphs: ["2D outline","inflate","spin"]
  - cue: REVEAL
    forms: ["Mug","Handle","Penguin-bridge"]
    typewriter: ["Ledger: PENGUIN_MUG", "Apéry witness .Q"]
  - cue: LEDGER_CHECK
    ledger: { entry: "PENGUIN_MUG", witness: ".Q" }
  - cue: NFT_RAIN
    badges:
      - {name: "MugLife", desc: "coffee lovers", zcm_hint: "story cozy"}
      - {name: "BirdBrain", desc: "penguin pun", zcm_hint: "sarcasm lol"}
  - cue: OUTRO
    cta: "Drop your guess for tomorrow!"
`;

describe("expand", () => {
  it("produces a timeline with receipts", () => {
    const b = parseYaml(Y);
    const { timeline, receipts } = expand(b);
    expect(timeline.length).toBeGreaterThan(3);
    expect(receipts.find(r=>r.entry==="PENGUIN_MUG")).toBeTruthy();
    expect(timeline.some(ev => ev.cue==="NFT_RAIN")).toBe(true);
  });
});
