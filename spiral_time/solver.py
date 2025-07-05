from datetime import datetime
from math import modf

from .constants import PHI, DELTA, K
from .theta_segments import theta


def get_julian_day(date: str) -> int:
    dt = datetime.strptime(date, "%Y-%m-%d")
    epoch = datetime(1970, 1, 1)
    return (dt - epoch).days


def get_mu(S: int) -> float:
    fractional, _ = modf(PHI ** S)
    return fractional


def lap(S: int) -> int:
    return S // 89


def wobble(lap_count: int) -> float:
    return K * (PHI ** (-lap_count))


def overlap(lap_count: int) -> float:
    return lap_count * (PHI ** -3)


def solve_spiral_time(date: str, S: int) -> dict:
    node = S % 89
    mu = get_mu(S)
    lap_count = lap(S)
    theta_val = theta(S)
    w = wobble(lap_count)
    ov = overlap(lap_count)
    t_seconds = ((node + mu + theta_val - ov) + w) * DELTA
    clock_str = f"{t_seconds:.3f}s"
    return {
        "t_seconds": t_seconds,
        "clock_str": clock_str,
        "node": node,
        "mu": mu,
        "lap": lap_count,
        "wobble": w,
    }
