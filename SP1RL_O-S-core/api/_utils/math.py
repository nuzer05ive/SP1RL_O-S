"""Math helpers for phi rotation."""

import math

phi = (1 + 5**0.5) / 2


def golden_rotation(k: int) -> float:
    """Return theta for index k."""
    return k * (1 / phi) * math.pi


def build_snapshot(user: str) -> dict:
    """Return minimal math snapshot for a user."""
    index = len(user) % 88
    return {
        "moment_index": index,
        "theta": golden_rotation(index),
        "phi_fraction": index / phi,
    }
