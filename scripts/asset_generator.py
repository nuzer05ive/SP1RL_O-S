import json
import os
import random
from pathlib import Path

from spiral_time.constants import PHI


def build_all(seed: str = "SP1RL-PHI"):
    """Build placeholder assets deterministically from a seed."""
    random.seed(seed)
    root = Path(__file__).resolve().parents[1] / "assets" / "generated"
    manifest = {}
    asset_types = ["episodes", "lenses", "hud", "audio"]
    for a_type in asset_types:
        t_dir = root / a_type
        t_dir.mkdir(parents=True, exist_ok=True)
        files = []
        for i in range(3):
            data = f"{a_type}-{i}-{random.random()}"
            f_path = t_dir / f"{a_type}_{i}.txt"
            with open(f_path, "w") as f:
                f.write(data)
            files.append(str(f_path.relative_to(root.parent)))
        manifest[a_type] = files
    manifest_path = root.parent / "assets_map.json"
    with open(manifest_path, "w") as f:
        json.dump(manifest, f)
    return manifest
