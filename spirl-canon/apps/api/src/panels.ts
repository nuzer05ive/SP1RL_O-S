import express from "express";
import fs from "fs";
import path from "path";

const r = express.Router();
const root = path.resolve(__dirname, "../../..");

const sharedDefaults = {
  version: "v1",
  world: 3, phiTiltIndex: 0, alphaDeg: 37.5, epsilon: 0.03934, thetaPrimeKappa: 1.12,
  kazerov: { enabled: true, N: 34, pq: [13,12], dutyBase: 0.50, eta: 0.35, sigmaDeg: 2.0 },
  music: { scoreCsv: "/music/Black_Block_Etude_Score.csv", wav: "/music/Black_Block_Etude.wav",
           paletteBias: { O:.9,B:.8,K:.7,Au:.5,Si:.6,R:.4,G:.4,BW:.5 } },
  pmb: { ecc: "RS(255,223)", tileSize: 32, rings: 3, diamond: "89^2", primeRibbon: true }
};

export function loadPanel(name: string) {
  const p = path.join(root, "panels", name);
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  return { ...sharedDefaults, ...j };
}

r.get("/panel/:name", (req, res) => {
  try { res.json(loadPanel(req.params.name)); }
  catch { res.status(404).json({ error: "panel not found" }); }
});

export default r;
