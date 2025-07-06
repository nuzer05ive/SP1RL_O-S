"""Math helpers for phi rotation."""
import math

phi = (1 + 5 ** 0.5) / 2


def golden_rotation(k: int) -> float:
    """Return theta for index k."""
    return k * (1 / phi) * math.pi
