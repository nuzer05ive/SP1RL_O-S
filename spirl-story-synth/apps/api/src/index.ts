import express from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs/promises";
import { spawn } from "child_process";
import { randomUUID } from "node:crypto";

const app = express(); app.use(express.json());
const upload = multer({ limits: { fileSize: 300*1024*1024 } });

const DATA = path.join(process.cwd(), "spirl-story-synth", "data");
const CHAR_DIR = path.join(DATA, "characters");
const SCN_DIR  = path.join(DATA, "scenes");
await fs.mkdir(CHAR_DIR, {recursive:true}); await fs.mkdir(SCN_DIR, {recursive:true});

app.post("/api/upload", upload.single("file"), async (req,res)=>{
  if(!req.file) return res.status(400).json({error:"no file"});
  const tmp = path.join(process.cwd(),"spirl-story-synth","uploads");
  await fs.mkdir(tmp,{recursive:true});
  const mp4 = path.join(tmp, Date.now()+"_"+(req.file.originalname||"upload.mp4"));
  await fs.writeFile(mp4, req.file.buffer);
  const py = spawn("python", ["workers/scan/spirl_scan.py", mp4], { cwd: path.join(process.cwd(),"spirl-story-synth") });
  py.on("close", async (code)=>{
    if(code!==0) return res.status(500).json({error:"scan failed"});
    const scanPath = path.join(path.dirname(mp4), "scan.json");
    const txt = await fs.readFile(scanPath,"utf-8");
    res.type("json").send(txt);
  });
});

app.post("/api/characters", async (req,res)=>{
  const id = randomUUID(); const now = new Date().toISOString();
  const obj = { ...req.body, id, createdAt: now, updatedAt: now };
  await fs.writeFile(path.join(CHAR_DIR, id+".json"), JSON.stringify(obj,null,2));
  res.json(obj);
});
app.get("/api/characters", async (_req,res)=>{
  const files = await fs.readdir(CHAR_DIR);
  const items = await Promise.all(files.map(f=>fs.readFile(path.join(CHAR_DIR,f),"utf-8").then(JSON.parse)));
  res.json(items);
});
app.post("/api/scenes", async (req,res)=>{
  const id = randomUUID(); const now = new Date().toISOString();
  const obj = { ...req.body, id, createdAt: now, updatedAt: now };
  await fs.writeFile(path.join(SCN_DIR, id+".json"), JSON.stringify(obj,null,2));
  res.json(obj);
});
app.get("/api/scenes", async (_req,res)=>{
  const files = await fs.readdir(SCN_DIR);
  const items = await Promise.all(files.map(f=>fs.readFile(path.join(SCN_DIR,f),"utf-8").then(JSON.parse)));
  res.json(items);
});

app.get("/api/health", (_req,res)=> res.json({ok:true}));
const PORT = process.env.PORT || 8788;
app.listen(PORT, ()=> console.log("api on", PORT));
