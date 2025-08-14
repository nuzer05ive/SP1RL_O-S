from datetime import datetime
import json, os, pathlib

def emit_runtime_docs(title, path):
    out = {
        "title": title,
        "signoff": path["steps"],
        "timestamp": datetime.utcnow().isoformat()+"Z",
        "principles": ["transparency","rights-preservation","plain-language","evidence-first"]
    }
    p = pathlib.Path("data/docs"); p.mkdir(parents=True, exist_ok=True)
    f = p / (title.replace(" ","_") + "_runtime.json")
    f.write_text(json.dumps(out, indent=2))
    return str(f)
