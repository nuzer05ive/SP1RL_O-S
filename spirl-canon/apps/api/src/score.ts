import { Router } from "express";
import { planPhiScore, scheduleScore } from "@spirl/core/src/phiScore";

const r = Router();

r.get("/music/phi-score", (_req, res) => {
  const plan = planPhiScore(0);
  res.json({ plan, events: scheduleScore(plan) });
});

export default r;
