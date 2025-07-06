"""Placeholder tilt math helpers."""

from .math import golden_rotation


def phi_array(n: int) -> list:
    """Return a small array of rotations."""
    return [golden_rotation(i) for i in range(n)]
