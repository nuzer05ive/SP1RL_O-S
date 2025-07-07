import json
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parents[2] / "data"
NODE_FILE = DATA_DIR / "node_lens.json"


def _load() -> dict:
    if NODE_FILE.exists():
        with open(NODE_FILE) as f:
            try:
                return json.load(f)
            except Exception:
                return {}
    return {}


def get_assets_for_node(node: int) -> dict:
    data = _load()
    node_str = str(node)
    if node_str in data:
        return data[node_str]
    return data.get(
        "default",
        {
            "yin_word": "yin",
            "yang_word": "yang",
            "yin_color": "white",
            "yang_color": "black",
        },
    )
