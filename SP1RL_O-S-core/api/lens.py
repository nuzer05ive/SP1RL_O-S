"""Node lens activation handlers."""
import json
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parents[2] / "data"
ACTIVE_FILE = DATA_DIR / "active_lens.json"


def _load():
    if ACTIVE_FILE.exists():
        with open(ACTIVE_FILE) as f:
            try:
                return json.load(f)
            except Exception:
                return {"active": 0}
    return {"active": 0}


def _save(data: dict):
    with open(ACTIVE_FILE, "w") as f:
        json.dump(data, f)


def set_lens(request):
    node = int(request.get("node", 0))
    data = _load()
    data["active"] = node
    _save(data)
    return {"active": node}


def status(_request=None):
    return _load()


def get_active_node() -> int:
    return _load().get("active", 0)
