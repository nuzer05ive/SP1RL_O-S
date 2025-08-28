import json
from pathlib import Path

FIXTURE = {
    "meta": {"fps": 24, "width": 64, "height": 64, "video": "offline"},
    "cadence": {"in": 0, "out": 1, "gap": 0, "half_gap": 0},
    "alphas": [0, 0, 0],
    "rails": [],
    "apex_times": []
}

def main():
    out_dir = Path("fixtures")
    out_dir.mkdir(exist_ok=True)
    with open(out_dir / "scan.json", "w") as f:
        json.dump(FIXTURE, f)

if __name__ == "__main__":
    main()
