"""Generate assets for TH.e-1RL_MONDAY.Ng."""

from datetime import datetime

from scripts.asset_generator import build_all


def generate_assets(seed: str = "SP1RL-PHI"):
    """Generate all TH.e-1RL_MONDAY.Ng assets and return a summary."""
    manifest = build_all(seed=seed)
    summary = {
        "asset_types": len(manifest),
        "count": sum(len(v) for v in manifest.values()),
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }
    return summary


if __name__ == "__main__":
    print(generate_assets())
