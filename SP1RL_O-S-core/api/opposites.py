"""Node-aware Yin/Yang vote handler."""

import json
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parents[2] / "data"
QUEUE_FILE = DATA_DIR / "opposites_queue.json"


def _load():
    if QUEUE_FILE.exists():
        with open(QUEUE_FILE) as f:
            try:
                return json.load(f)
            except Exception:
                return {}
    return {}


def _save(data: dict):
    with open(QUEUE_FILE, "w") as f:
        json.dump(data, f)


def next_pair(_request=None):
    return _load()


def vote(request):
    data = _load()
    node = str(request.get("node", 0))
    choice = request.get("vote")
    node_votes = data.setdefault("node_votes", {})
    record = node_votes.setdefault(node, {"yes": 0, "no": 0, "signoffs": 0})
    if choice == "yes":
        record["yes"] += 1
        if record["yes"] >= 3:
            record["signoffs"] += 1
            record["yes"] = 0
            record["no"] = 0
    elif choice == "no":
        record["no"] += 1
    _save(data)
    return record
