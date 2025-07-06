"""Pedal stroke handler."""
from ._utils.pw import mint_pw
from pathlib import Path
from datetime import datetime
import json


def handler(request):
    strokes = request.get("strokes", 1)
    user = request.get("user", "anon")
    res = {"minted": mint_pw(strokes)}
    if strokes >= 12:
        ts = datetime.utcnow().strftime("%Y%m%d%H%M%S")
        petal_dir = Path(f"frontend/petals/{user}")
        petal_dir.mkdir(parents=True, exist_ok=True)
        stub_path = petal_dir / f"{ts}.json"
        with open(stub_path, "w") as f:
            json.dump({}, f)
        h = f"{user}-{ts}"
        sync_path = Path(f"backend/sync/{h}")
        sync_path.mkdir(parents=True, exist_ok=True)
        res.update({"draft": str(stub_path), "branch": f"petal/{h}"})
    return res
