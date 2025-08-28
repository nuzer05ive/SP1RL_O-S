import express from "express";
import multer from "multer";
import { spawn } from "child_process";
import path from "node:path";
import fs from "node:fs/promises";

const app = express();
const upload = multer({ limits: { fileSize: 256*1024*1024 } });

app.post("/api/upload", upload.single("file"), async (req,res) => {
  if (!req.file) return res.status(400).json({error:"no file"});
  const tmp = path.join(process.cwd(), "uploads");
  await fs.mkdir(tmp, {recursive:true});
  const mp4 = path.join(tmp, Date.now()+"_"+req.file.originalname);
  await fs.writeFile(mp4, req.file.buffer);
  // call Python worker locally
  const py = spawn("python", ["workers/scan/spirl_scan.py", mp4], { cwd: path.join(process.cwd()) });
  let out=""; let err="";
  py.stdout.on("data",d=> out+=d.toString()); py.stderr.on("data",d=> err+=d.toString());
  py.on("close", async code => {
    if (code!==0) return res.status(500).json({error:"scan failed", err});
    const scanPath = path.join(path.dirname(mp4), "scan.json");
    const json = await fs.readFile(scanPath, "utf-8");
    res.json(JSON.parse(json));
  });
});

app.get("/api/health", (_req,res)=> res.json({ok:true}));

const PORT = process.env.PORT || 8788;
app.listen(PORT, ()=> console.log("api on", PORT));
