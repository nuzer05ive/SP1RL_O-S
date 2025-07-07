"""Pedal stroke handler."""

import json
from datetime import datetime
from pathlib import Path

from ._utils.pw import mint_pw

DATA_DIR = Path(__file__).resolve().parents[2] / "data"
LEDGER_FILE = DATA_DIR / "pw_ledger.json"


def _load_ledger():
    if LEDGER_FILE.exists():
        with open(LEDGER_FILE) as f:
            try:
                return json.load(f)
            except Exception:
                return {}
    return {}


def _save_ledger(data: dict):
    with open(LEDGER_FILE, "w") as f:
        json.dump(data, f, indent=2)


def handler(request):
    strokes = request.get("strokes", 1)
    user = request.get("user", "anon")
    mint = mint_pw(strokes)
    ledger = _load_ledger()
    ledger[user] = round(ledger.get(user, 0) + mint, 2)
    _save_ledger(ledger)
    res = {"minted": mint, "total": ledger[user]}
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
