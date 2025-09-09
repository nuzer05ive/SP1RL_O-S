import { Router } from "express";
import { makeTriplets, hinge, eccParity } from "@spirl/core/src/las";
import { evaporate } from "@spirl/core/src/cycloid";

const r = Router();

r.post("/las/patch", (req, res) => {
  const { beads } = req.body;
  const trips = makeTriplets(beads);
  const filled = trips.map(t => t.S && t.S.text ? t : ({ ...t, S: { ...t.S, text: hinge(t.A.text, t.B.text) } }));
  const ok = filled.every(eccParity);
  res.json({ ok, triplets: filled });
});

r.post("/las/evaporate", (req, res) => {
  const { signal } = req.body;
  const { compRatio } = evaporate(signal, 5);
  res.json({ compRatio });
});

r.post("/las/analogize", (req, res) => {
  const { A, B } = req.body;
  res.json({ S: hinge(A, B) });
});

export default r;
