"""API endpoints for TH.e-1RL_MONDAY.Ng asset generation."""

import json
from pathlib import Path

from tools.the_one_real_monday_generator import generate_assets


def generate():
    """Trigger the asset generator and return a status."""
    summary = generate_assets()
    return summary


def assets_map():
    """Return the asset manifest."""
    path = Path(__file__).resolve().parents[1] / "assets" / "assets_map.json"
    with open(path) as f:
        return json.load(f)
