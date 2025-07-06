import json
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parents[1] / "data"
LOG_FILE = DATA_DIR / "lore_chapters.json"
LEDGER_FILE = DATA_DIR / "pw_ledger.json"
CHAPTER_DIR = DATA_DIR / "lore_chapters"
CHAPTER_DIR.mkdir(exist_ok=True)


def _load(path: Path):
    if path.exists():
        with open(path) as f:
            try:
                return json.load(f)
            except Exception:
                return {}
    return {}


def _save(path: Path, data: dict):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)


def append_chapter(node: int, pair_id: str, user: str) -> tuple[str, int]:
    """Append a chapter record and return title and depth."""
    log = _load(LOG_FILE)
    chapters = log.get("chapters", [])

    prev_depth = 0
    for ch in chapters:
        if ch["node"] == node and ch["pair_id"] == pair_id:
            prev_depth = max(prev_depth, ch.get("depth", 1))

    depth = prev_depth + 1
    episode = len(chapters) + 1
    supers = "\u2070\u00b9\u00b2\u00b3\u2074\u2075\u2076\u2077\u2078\u2079"
    def sup(n: int) -> str:
        return "".join(supers[int(d)] for d in str(n))

    eri_suffix = "" if depth == 1 else sup(depth)
    title = f"Episode {episode:03d} — Node-{node} Bloom .e.Ri{eri_suffix}"

    chapters.append({
        "episode": episode,
        "node": node,
        "pair_id": pair_id,
        "depth": depth,
        "title": title,
    })
    log["chapters"] = chapters
    _save(LOG_FILE, log)

    chapter_path = CHAPTER_DIR / f"episode_{episode:03d}.md"
    with open(chapter_path, "w") as md:
        md.write(f"# {title}\n\n")
        md.write("TBD narrative\n")

    ledger = _load(LEDGER_FILE)
    if depth > 1 and depth > prev_depth:
        ledger[user] = round(ledger.get(user, 0) + 0.05, 2)
        _save(LEDGER_FILE, ledger)

    return title, depth


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Append a lore chapter entry")
    parser.add_argument("node", type=int)
    parser.add_argument("pair_id")
    parser.add_argument("user")
    args = parser.parse_args()

    title, depth = append_chapter(args.node, args.pair_id, args.user)
    print(title)
