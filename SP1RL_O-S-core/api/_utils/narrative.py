from pathlib import Path
from .lexicon import get_assets_for_node

TEMPLATE_DIR = Path(__file__).resolve().parent / "templates"

with open(TEMPLATE_DIR / "stanza.txt") as f:
    STANZA = f.read()


def compose(snapshot: dict, node: int) -> str:
    tok = snapshot.copy()
    tok.update(get_assets_for_node(node))
    return STANZA.format(**tok)
