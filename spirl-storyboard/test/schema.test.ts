import { parseYaml } from "../src/schema";

const Y = `
meta:
  id: "ep-001"
  title: "Penguin Mug"
  episode: "S1E12"
  date: "2025-08-29"
  cast: ["Kap","Greg","Dewey","Sophia",".Q"]
cues:
  - cue: SCROLL_OPEN
    vo: "You only see the shadows…"
  - cue: COMMENTS_HOST
    host: "Greg"
    comments:
      - {by: viewer, text: "It’s clearly a coffee mug."}
      - {by: greg,   text: "Let me find out!!"}
`;

describe("schema", () => {
  it("parses minimal YAML", () => {
    const b = parseYaml(Y);
    expect(b.meta.title).toBe("Penguin Mug");
    expect(b.cues.length).toBeGreaterThan(0);
  });
});
