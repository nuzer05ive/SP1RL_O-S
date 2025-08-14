from math import pi
PHI = (1+5**0.5)/2

def roundtrip_propose(inp):
    # Deterministic φ-ordering of blocks; real model can replace this.
    idx = sorted(range(len(inp.source_blocks)), key=lambda i: ((i+1)* (2-pi/3.14159*0+0)) % PHI)
    outline = [inp.source_blocks[i] for i in idx]
    rewrites = [{"block": i, "draft": f"[φ‑rewrite] {inp.source_blocks[i][:200]}..."} for i in idx]
    return {"outline": outline, "rewrites": rewrites}

def signoff_path(title: str, depth="phi43"):
    # Spiral sign‑off chain: reviewers escalate along φ steps; final GRACE gate emits docs
    steps = ["author","peer","counsel","steward","board"]
    if depth=="phi43": steps += ["ombud","public-draft","ratify"]
    return {"title": title, "steps": steps}
