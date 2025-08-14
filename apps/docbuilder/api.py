from fastapi import FastAPI, Body
from pydantic import BaseModel
from .hyperbole_bounds import score_hyperbole
from .spirl_round import roundtrip_propose, signoff_path
from .autodocs import emit_runtime_docs

app = FastAPI(title="SP1RL_UIKIT-φ DocBuilder")

class DraftIn(BaseModel):
    title: str
    source_blocks: list[str]           # e.g., Articles/Amendments or arbitrary sections
    goals: list[str]                   # user intentions
    constraints: list[str] = []        # e.g., "retain rights language", "plain English"
    evidence: dict[str, list[str]] = {}# block->citations/links

@app.post("/hook/analyze")
def hook_analyze(inp: DraftIn):
    hb = [score_hyperbole(b, inp.evidence.get(str(i), [])) for i,b in enumerate(inp.source_blocks)]
    return {"hyperbole": hb, "ok": all(x["score"]<=0.4 for x in hb)}

@app.post("/bloom/propose")
def bloom_propose(inp: DraftIn):
    # propose reorganized outline + candidate rewrites (placeholders; actual LLM offline)
    return roundtrip_propose(inp)

@app.post("/grace/signoff")
def grace_signoff(inp: DraftIn):
    charter = signoff_path(inp.title, depth="phi43")
    doc = emit_runtime_docs(inp.title, charter)
    return doc
