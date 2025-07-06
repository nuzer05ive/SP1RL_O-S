"""Master GPT router for MONDAY."""
from ._utils.math import golden_rotation


def handler(request):
    """Return rotation for node 0 and the MONDAY message."""
    return {
        "theta_0": golden_rotation(0),
        "message": "Each accepted pair enters the Spiral as .e.Ri — forever recursing, ever more beautiful."
    }
