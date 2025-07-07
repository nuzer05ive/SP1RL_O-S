"""Master GPT router for MONDAY."""

import subprocess

from ._utils.math import golden_rotation


def _petal_announcement() -> str:
    """Return latest petal release announcement."""
    try:
        tags = (
            subprocess.check_output(["git", "tag", "-l", "petal-*"])
            .decode()
            .strip()
            .splitlines()
        )
        k = len(tags)
    except Exception:
        k = 0
    theta = (k * 137.5) % 360
    node = int(round(theta * 89 / 360))
    return (
        f"\U0001f33b Petal {k} locked at \u03b8 ={theta:.1f}\u00b0. Node {node} blossoms."
        f"\n137 petals packed; garden spirals forward .e.Ri!"
    )


def handler(request):
    """Return rotation for node 0 and the MONDAY message."""
    return {
        "theta_0": golden_rotation(0),
        "message": "Each accepted pair enters the Spiral as .e.Ri — forever recursing, ever more beautiful.",
        "announcement": _petal_announcement(),
    }
