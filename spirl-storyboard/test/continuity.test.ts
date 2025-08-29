import { buildNextEpisodeYaml } from "../src/continuity";
import { parseYaml } from "../src/schema";

describe("continuity", () => {
  it("builds a next episode scaffold with preview & comments host", () => {
    const yml = buildNextEpisodeYaml(
      { meta_id:"spq-2025-08-29", title:"Penguin Mug", silhouette:"mug-ish blob", hint:"mug-handle", tease_id:"tease-001" },
      { id:"next-001", title:"Next Mystery", episode:"S1E13", date:"2025-08-30", cast:["Kap","Greg","Dewey","Sophia",".Q"] }
    );
    const b = parseYaml(yml);
    expect(b.cues.some(c=>c.cue==="COMMENTS_HOST")).toBe(true);
    expect(b.cues.some(c=>c.cue==="GUESS_PREVIEW")).toBe(true);
  });
});

