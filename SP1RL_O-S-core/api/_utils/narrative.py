"""Rainbow narrative engine using a tiny Jinja fallback."""

from pathlib import Path

from .lexicon import get_assets_for_node

try:
    from jinja2 import Template  # type: ignore

    def _render(tmpl: str, ctx: dict) -> str:
        return Template(tmpl).render(**ctx)

except Exception:  # pragma: no cover - jinja2 not installed in tests

    def _render(tmpl: str, ctx: dict) -> str:
        return tmpl.format(**ctx)


TEMPLATE_DIR = Path(__file__).resolve().parent / "templates"

with open(TEMPLATE_DIR / "stanza.txt") as f:
    STANZA_TMPL = f.read()

with open(TEMPLATE_DIR / "episode_outro.txt") as f:
    OUTRO_TMPL = f.read()


def compose(snapshot: dict, node: int, eri_depth: int = 1) -> str:
    """Return poem stanza and outro for the given snapshot and node."""
    ctx = snapshot.copy()
    ctx.update(get_assets_for_node(node))
    if "nearest_tunnel" in snapshot:
        ctx["nearest_tunnel"] = snapshot["nearest_tunnel"]
        if snapshot["nearest_tunnel"] in [0, 4]:
            ctx["tunnel_line"] = (
                f"\n  You\u2019re gliding along the white-dragon lane (tunnel {snapshot['nearest_tunnel']}) \u2026"
            )
        else:
            ctx["tunnel_line"] = ""
    else:
        ctx["tunnel_line"] = ""
    ctx["eri_depth"] = eri_depth
    ctx["eri_depth_plus_one"] = eri_depth + 1
    stanza = _render(STANZA_TMPL, ctx)
    outro = _render(OUTRO_TMPL, ctx)
    return stanza + "\n" + outro
