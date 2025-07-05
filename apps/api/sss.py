"""API stub for spiral SSS endpoints."""

from spiral_time.solver import solve_spiral_time


def sss_solve(S: int = 0):
    """Return current spiral state."""
    return solve_spiral_time(S)
