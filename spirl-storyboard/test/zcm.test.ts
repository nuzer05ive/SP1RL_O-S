import { zcmFromText, zcmScore } from "../src/zcm";

describe("ZCM", () => {
  it("detects sarcasm/clarity", () => {
    const a = zcmFromText("lol obviously!! define the ratio");
    expect(a.sarcasm).toBeGreaterThan(0);
    expect(a.clarity).toBeGreaterThan(0);
    const s = zcmScore(a);
    expect(s).toBeGreaterThan(0.1);
  });
});
