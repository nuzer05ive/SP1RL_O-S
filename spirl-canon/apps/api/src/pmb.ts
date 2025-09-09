import express from "express";
import { pmbEncodeStub, pmbDecodeStub, PMBPayload } from "../../packages/core/src/pmb";
const r = express.Router();

r.post("/pmb/encode", (req, res) => {
  const payload = req.body as PMBPayload;
  const png = pmbEncodeStub(payload);
  res.type("image/png").send(png);
});

r.post("/pmb/decode", (req, res) => {
  const img = Buffer.from(req.body.img || "", "base64");
  const payload = pmbDecodeStub(img);
  res.json({ payload });
});

export default r;
