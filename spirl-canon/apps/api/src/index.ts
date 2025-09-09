import express from "express";
import bodyParser from "body-parser";
import pmbRouter from "./pmb";
import panelsRouter from "./panels";

const app = express();
app.use(bodyParser.json({ limit: "4mb" }));

app.get("/healthz", (_,res)=>res.json({ok:true}));
app.use(pmbRouter);
app.use(panelsRouter);

const PORT = 8788;
app.listen(PORT, ()=> console.log(`[api] listening on :${PORT}`));
