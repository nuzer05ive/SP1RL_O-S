import { nearInt, anchorsDemo, analyzeShard, wobbleStep } from "../SpiralConstants";
test("e^2.3 ≈ 9.974 near 10", ()=>{
  const x = Math.E**2.3;
  expect(Math.abs(nearInt(x).err)).toBeLessThan(0.05);
});
test("e^4.6 ≈ 99.48 near 100", ()=>{
  const x = Math.E**4.6;
  expect(Math.abs(nearInt(x).err)).toBeLessThan(1.0);
});
test("wobble step to 1.0 ~ integer k", ()=>{
  const w = wobbleStep(1.0, false);
  expect(w.k).toBeGreaterThan(1000);
  expect(w.err).toBeLessThan(1e-3);
});
test("shard 359976232289 primes length ok", ()=>{
  const sh = analyzeShard("359976232289");
  expect(sh.primes.length).toBeGreaterThan(0);
});
