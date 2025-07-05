"""Segment-wise theta(S) lookup.
This module contains anchor-based theta values that can be
interpolated by solve_spiral_time. In this stub implementation
we use a minimal lookup dictionary for demonstration.
"""

from typing import Dict

# Example anchor segments; real values would come from spiral_log.json
THETA_SEGMENTS: Dict[int, float] = {
    0: 0.0,
    100: 0.1,
    200: 0.2,
}


def theta(S: int) -> float:
    """Return theta(S) from the nearest segment anchor."""
    keys = sorted(THETA_SEGMENTS.keys(), reverse=True)
    for k in keys:
        if S >= k:
            return THETA_SEGMENTS[k]
    return 0.0
