from datetime import datetime
import json, pathlib
from .spiral_stamp import mint as mint_spiral


def grace_signoff(charter: dict, place: str = "Field/Unknown") -> dict:
    doc = {
        "charter": charter,
        "signoff": {
            "stamp": mint_spiral(place).__dict__,
            "who": "GRACE",
            "status": "queued"
        }
    }
    return doc


def emit_runtime_docs(title, charter, place: str = "Field/Unknown"):
    doc = grace_signoff(charter, place)
    out = {
        "title": title,
        "charter": charter,
        "signoff": doc["signoff"],
        "timestamp": datetime.utcnow().isoformat()+"Z",
        "principles": ["transparency","rights-preservation","plain-language","evidence-first"]
    }
    p = pathlib.Path("data/docs"); p.mkdir(parents=True, exist_ok=True)
    f = p / (title.replace(" ","_") + "_runtime.json")
    f.write_text(json.dumps(out, indent=2))
    return out
