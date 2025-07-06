"""Witness API utilities handling mint gating and timelines."""
import json
from pathlib import Path
from spiral_time.solver import solve_spiral_time, get_julian_day
from spiral_time.constants import PHI


def load_user() -> dict:
    path = Path(__file__).resolve().parents[1] / 'data' / 'witness_scrolls.json'
    with open(path) as f:
        return json.load(f)


def can_mint(user: dict, desired_node: int) -> bool:
    return desired_node == user['assigned_node'] or user['wings_earned']


def phi_timeline(birthdate: str):
    from datetime import timedelta, datetime
    base = datetime.strptime(birthdate, "%Y-%m-%d")
    return {f"phi^{n}": (base + timedelta(days=int(PHI**n))).strftime("%Y-%m-%d")
            for n in (5, 8, 13)}


def witness_profile(user_id: str, birthdate: str, desired_node: int) -> dict:
    user = load_user()
    J_birth = get_julian_day(birthdate)
    user['assigned_node'] = solve_spiral_time(J_birth % 144)['node']
    user['petals'] = phi_timeline(birthdate)
    tau_multiple = solve_spiral_time(J_birth)['τ_multiple']
    return {
        'user_id': user_id,
        'assigned_node': user['assigned_node'],
        'lap0_tau_offset': user.get('lap0_tau_offset', 0.0),
        'wings_earned': user.get('wings_earned', False),
        'petals': user['petals'],
        'τ_multiple': tau_multiple,
        'can_mint': can_mint(user, desired_node),
    }
