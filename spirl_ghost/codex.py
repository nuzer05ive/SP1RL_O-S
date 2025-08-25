from __future__ import annotations

"""Codex ingest pipeline for SPIRL Ghost.

Implementation is intentionally lightweight yet deterministic.  Functions return
plain Python structures so that unit tests can exercise the behaviour without
external dependencies.
"""

from dataclasses import dataclass
from hashlib import sha256
import json
import os
import random
from typing import Dict, Iterable, List, Tuple


@dataclass
class Parsed:
    """Container for the parsed iN-SeRT payload."""

    canon: str
    glyphs: List[dict]
    beats: List[dict]
    pairs: List[dict]
    switcharoo: bool
    meta: dict


def load(iN: Dict) -> Parsed:
    """Validate and normalise the inbound payload."""

    required = {"canon", "glyphs", "beats", "pairs", "switchARoo", "meta"}
    missing = required - set(iN)
    if missing:
        raise KeyError(f"missing keys: {missing}")
    return Parsed(
        canon=iN["canon"],
        glyphs=iN["glyphs"],
        beats=iN["beats"],
        pairs=iN["pairs"],
        switcharoo=bool(iN["switchARoo"]),
        meta=iN["meta"],
    )


def lift_cube(parsed: Parsed, alpha: float, theta: float) -> Dict:
    """Lift the witness cube into a rail map.

    Each beat becomes a node whose address hashes its diamond with ``alpha`` and
    ``theta``.  POV indicates if switcharoo was enabled.
    """

    nodes: List[Dict[str, str]] = []
    for idx, beat in enumerate(parsed.beats, 1):
        seed_str = f"{beat.get('diamond','')}-{alpha}-{theta}-{idx}"
        addr = "PP:" + sha256(seed_str.encode()).hexdigest()[:32]
        corner = f"N{idx-1}"
        if parsed.switcharoo:
            corner = corner.replace("N", "S")
        nodes.append({"id": idx, "corner": corner, "addr": addr})
    rail_map = {
        "order": "1D-Ra//L",
        "pov": "switcharoo" if parsed.switcharoo else "normal",
        "nodes": nodes,
    }
    return rail_map


def align_pairs(pairs: Iterable[Dict], seed: int, variants: int = 88) -> Tuple[Dict, List[float]]:
    """Run a deterministic 88→89 tournament."""

    rng = random.Random(seed)
    scores = []
    base = pairs[0].get("weight", 0.0) if pairs else 0.0
    for _ in range(variants):
        scores.append(base + rng.random() * 0.1)
    best_idx, best_score = max(enumerate(scores, 1), key=lambda x: x[1])
    victor = {"index": best_idx, "score": round(best_score, 2)}
    return victor, scores


def weave_chapter(parsed: Parsed, order: str = "VSO", K: int = 5) -> Dict[str, str]:
    """Generate FAQ markdown and a paragraph with triplet cadence."""

    faq = ["# FAQ", "", "Q: Canon?", f"A: {parsed.canon.strip()}", ""]
    sentences: List[str] = []
    for i, beat in enumerate(parsed.beats, 1):
        s = f"{beat['petal']} meets {beat['petal2']}."
        if i % 3 == 0:
            s += f" {beat['diamond']} shines."
        sentences.append(s)
    paragraph = " ".join(sentences)
    faq_md = "\n".join(faq) + "\n"
    return {"faq_md": faq_md, "paragraph": paragraph}


def layout_ui(parsed: Parsed, grid: Tuple[int, int] = (12, 8)) -> Dict:
    """Produce a deterministic UI layout confined to a grid."""

    w, h = grid
    atoms = []
    for i, g in enumerate(parsed.glyphs):
        atoms.append({
            "id": g["name"],
            "x": i % w,
            "y": i % h,
            "w": 1,
            "h": 1,
            "color": "#dc2626" if i % 2 else "#0ea5e9",
        })
    layout = {
        "grid": grid,
        "header": {"rotation": 137.5, "color": "#0ea5e9"},
        "atoms": atoms,
    }
    return layout


def seal(outputs: Dict[str, str], addr_seed: int) -> Dict[str, str]:
    """Seal outputs by producing prime/build hashes and appending to the ledger."""

    prime_address = sha256(f"{addr_seed}".encode()).hexdigest()[:16]
    concat = "".join(sorted(outputs.values()))
    build_hash = sha256(concat.encode()).hexdigest()
    ledger_line = json.dumps({"prime_address": prime_address, "build_hash": build_hash})
    os.makedirs(".ledger", exist_ok=True)
    ledger_path = os.path.join(".ledger", "ledger.jsonl")
    with open(ledger_path, "a", encoding="utf-8") as fh:
        fh.write(ledger_line + "\n")
    ledger_hash = sha256(ledger_line.encode()).hexdigest()
    return {
        "prime_address": prime_address,
        "build_hash": build_hash,
        "ledger_hash": ledger_hash,
    }
