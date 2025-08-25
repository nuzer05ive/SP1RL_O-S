from __future__ import annotations

"""Command line interface for SPIRL Ghost."""

import argparse
import json
import os
from pathlib import Path
from typing import Any
import sys

ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from spirl_ghost import codex


def cmd_init(args: argparse.Namespace) -> None:
    """Initialise output and ledger directories."""

    Path("out").mkdir(exist_ok=True)
    Path(".ledger").mkdir(exist_ok=True)


def cmd_codex_ingest(args: argparse.Namespace) -> None:
    with open(args.infile, "r", encoding="utf-8") as fh:
        payload = json.load(fh)
    parsed = codex.load(payload)
    rail_map = codex.lift_cube(parsed, args.alpha, args.theta)
    victor, report = codex.align_pairs(parsed.pairs, args.seed, args.variants)
    rail_map["victor89"] = victor
    ab_report_hash = codex.sha256(json.dumps(report).encode()).hexdigest() if hasattr(codex, 'sha256') else None
    # Actually compute hash directly
    import hashlib
    ab_report_hash = hashlib.sha256(json.dumps(report).encode()).hexdigest()
    rail_map["ab_report_hash"] = ab_report_hash
    chapter = codex.weave_chapter(parsed)
    layout = codex.layout_ui(parsed)
    outputs = {
        "rail_map": json.dumps(rail_map, indent=2),
        "faq_md": chapter["faq_md"],
        "paragraph": chapter["paragraph"],
        "ui_layouts": json.dumps(layout, indent=2),
        "ab_report": json.dumps(report, indent=2),
    }
    seals = codex.seal(outputs, addr_seed=args.seed)
    footer = f"\nPrime-Address: {seals['prime_address']}\nBuild-Hash: {seals['build_hash']}\n"
    Path("out").mkdir(exist_ok=True)
    with open("out/rail_map.json", "w", encoding="utf-8") as fh:
        fh.write(outputs["rail_map"] + footer)
    with open("out/faq.md", "w", encoding="utf-8") as fh:
        fh.write(outputs["faq_md"] + footer)
    with open("out/paragraph.txt", "w", encoding="utf-8") as fh:
        fh.write(outputs["paragraph"] + footer)
    with open("out/ui_layouts.json", "w", encoding="utf-8") as fh:
        fh.write(outputs["ui_layouts"] + footer)
    with open("out/ab_report.json", "w", encoding="utf-8") as fh:
        fh.write(outputs["ab_report"] + footer)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="spirl")
    sub = parser.add_subparsers(dest="command")

    p_init = sub.add_parser("init")
    p_init.set_defaults(func=cmd_init)

    p_codex = sub.add_parser("codex")
    codex_sub = p_codex.add_subparsers(dest="codex_cmd")

    p_ingest = codex_sub.add_parser("ingest")
    p_ingest.add_argument("--in", dest="infile", required=True)
    p_ingest.add_argument("--seed", type=int, default=0)
    p_ingest.add_argument("--variants", type=int, default=88)
    p_ingest.add_argument("--alpha", type=float, default=0.618033)
    p_ingest.add_argument("--theta", type=float, default=0.1416)
    p_ingest.add_argument("--switcharoo", action="store_true")
    p_ingest.set_defaults(func=cmd_codex_ingest)

    return parser


def main(argv: Any | None = None) -> None:
    parser = build_parser()
    args = parser.parse_args(argv)
    if not hasattr(args, "func"):
        parser.print_help()
        return
    args.func(args)


if __name__ == "__main__":  # pragma: no cover
    main()
