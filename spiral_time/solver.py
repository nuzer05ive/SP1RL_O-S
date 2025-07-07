"""Spiral time solver based on the canonical φ formulation."""

from datetime import datetime

from .constants import (
    DELTA,
    PHI,
    PSI,
    K,
    TUNNEL_COUNT,
    TUNNEL_ANGLES,
)
from .theta_segments import theta


def get_julian_day(date: str) -> int:
    dt = datetime.strptime(date, "%Y-%m-%d")
    epoch = datetime(1970, 1, 1)
    return (dt - epoch).days


def mu(S: int) -> float:
    """Return μ(S) = (φ·S) mod 1."""
    return (PHI * S) % 1


def lap(S: int) -> int:
    return S // 89


def wobble(lap_count: int) -> float:
    """Return wobble term k·φ^(-lap)."""
    return K * (PHI**-lap_count)


def overlap(lap_count: int) -> float:
    """Return overlap term lap·ψ with ψ=φ⁻³."""
    return lap_count * PSI


def solve_spiral_time(S: int) -> dict:
    """Return spiral time breakdown for index ``S``."""
    n = S % 89
    lap_count = lap(S)
    th = theta(S)
    tunnel = min(
        range(TUNNEL_COUNT),
        key=lambda k: abs(th - TUNNEL_ANGLES[k]),
    )
    m = mu(S)
    w = wobble(lap_count)
    ov = overlap(lap_count)
    t = ((n + m + th - ov + w) * DELTA) % 86400
    h, r = divmod(int(t), 3600)
    m_, s = divmod(r, 60)
    return {
        "clock": f"{h:02}:{m_:02}:{s:02}.{int((t%1)*1000):03}",
        "seconds": t,
        "node": n,
        "lap": lap_count,
        "μ": m,
        "τ_multiple": round(t / (DELTA / 10), 3),
        "nearest_tunnel": tunnel,
    }


def solve_sss(datetime_str: str) -> dict:
    """Simplified solver that accepts a combined date-time string."""
    date_part = datetime_str.split("T")[0].split(" ")[0]
    S = get_julian_day(date_part)
    return solve_spiral_time(S)
