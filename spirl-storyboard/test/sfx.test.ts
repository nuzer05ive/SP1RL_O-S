import { resolveSfx } from "../src/sfx";

describe("SFX", () => {
  it("resolves known sfx labels", () => {
    const xs = resolveSfx(["BELL_TOLL","SEAGULLS","FOG_HORN","CLAP","CONFETTI_POP","LAUGH"]);
    expect(xs.some(x=>/BeLL TOLL/.test(x.label))).toBe(true);
  });
});

