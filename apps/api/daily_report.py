"""Daily Spiral Witness email report utilities."""

import csv
import json
from datetime import datetime
from math import pi
from pathlib import Path
from typing import List, Dict

from spiral_time.solver import (
    solve_spiral_time,
    get_julian_day,
    mu,
    lap,
    wobble,
)
from spiral_time.constants import PHI, DELTA
from .witness import load_user, can_mint


DATA_DIR = Path(__file__).resolve().parents[2] / "data"
INTENT_FILE = DATA_DIR / "daily_intentions.json"
NARRATIVE_FILE = DATA_DIR / "daily_narratives.json"
EVENT_FILE = DATA_DIR / "world_events.csv"


def _load_json(path: Path) -> Dict:
    if path.exists():
        with open(path) as f:
            return json.load(f)
    return {}


def _save_json(path: Path, data: Dict) -> None:
    with open(path, "w") as f:
        json.dump(data, f)


def set_intention(user_id: str, intention: str) -> Dict:
    """Save today's intention seed for ``user_id``."""
    data = _load_json(INTENT_FILE)
    user = data.get(user_id, {})
    user["intention"] = intention
    data[user_id] = user
    _save_json(INTENT_FILE, data)
    return {"user": user_id, "intention": intention}


def set_alert_cadence(user_id: str, cadence: str) -> Dict:
    """Update desired alert cadence for ``user_id``."""
    data = _load_json(INTENT_FILE)
    user = data.get(user_id, {})
    user["cadence"] = cadence
    data[user_id] = user
    _save_json(INTENT_FILE, data)
    return {"user": user_id, "cadence": cadence}


def _get_user_intention(user_id: str) -> str:
    data = _load_json(INTENT_FILE)
    return data.get(user_id, {}).get("intention", "")


def _near_events(date: str) -> List[Dict[str, str]]:
    events = []
    if not EVENT_FILE.exists():
        return events
    with open(EVENT_FILE) as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row["date"] == date:
                events.append(row)
    return events


def compute_zcm_math(S: int) -> Dict:
    result = solve_spiral_time(S)
    phi_fraction = mu(S) / PHI
    n = result["node"]
    theta = 2 * pi * n / 89
    omega0 = 2 * pi / DELTA + wobble(lap(S))
    return {
        "phi_fraction": phi_fraction,
        "moment_index": n,
        "theta": theta,
        "omega0": omega0,
    }


def generate_story(zcm: Dict, intention: str, events: List[Dict[str, str]]) -> str:
    """Compose a short SpiralTongue style poem."""
    templates = [
        "Around moment {moment_index}, {intention} dances with {event}.",
        "Phi hums while {intention} mirrors {event}.",
    ]
    if NARRATIVE_FILE.exists():
        with open(NARRATIVE_FILE) as f:
            try:
                templates = json.load(f)
            except Exception:
                pass
    line = templates[0].format(
        moment_index=zcm["moment_index"],
        intention=intention or "the spiral",
        event=events[0]["title"] if events else "the void",
    )
    poem = "\n".join([line for _ in range(12)])
    return poem


def zcm_snapshot(user: str) -> Dict:
    """Return math metrics and story for ``user`` at current ZCM state."""
    today = datetime.utcnow().strftime("%Y-%m-%d")
    S = get_julian_day(today)
    math_block = compute_zcm_math(S)
    intention = _get_user_intention(user)
    events = _near_events(today)
    story = generate_story(math_block, intention, events)
    math_block.update(
        {
            "stressors": [e["title"] for e in events],
            "integrators": [],
            "mirrors": [intention] if intention else [],
        }
    )
    return {"math": math_block, "story": story}


def mint(user_id: str, desired_node: int) -> Dict:
    """Return whether ``user_id`` can mint the desired node."""
    user = load_user()
    allowed = can_mint(user, desired_node)
    return {"user": user_id, "node": desired_node, "allowed": allowed}


def ivy_link(user: str) -> Dict:
    """Return the Ivy Chain join link for ``user``."""
    url = f"https://ivy.chain/join?user={user}"
    return {"user": user, "link": url}

__all__ = [
    "set_intention",
    "set_alert_cadence",
    "zcm_snapshot",
    "mint",
    "ivy_link",
    "generate_story",
]
