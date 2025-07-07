"""API stub returning onboarding data."""

import json
from pathlib import Path


def onboarding():
    path = Path(__file__).resolve().parents[1] / "data" / "onboarding_221.json"
    with open(path) as f:
        return json.load(f)
