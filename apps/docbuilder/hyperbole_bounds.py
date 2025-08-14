import re
from collections import Counter

# Simple “hyperbole bound”: assertive terms without support are penalized.
ASSERTIVE = {"always","never","undeniable","everyone","no one","perfect","guarantee","best","worst"}
WEASEL = {"some","many","people say","it is said","reportedly"}
def score_hyperbole(text: str, citations: list[str]) -> dict:
    t = text.lower()
    a = sum(w in t for w in ASSERTIVE)
    w = sum(1 for w in WEASEL if w in t)
    c = len([u for u in citations if isinstance(u,str) and u.strip()])
    score = max(0.0, (a*0.3 + w*0.15) - (0.2 * min(c,3)))
    return {"score": round(score,3), "assertive_hits": a, "weasel_hits": w, "citations": c}
