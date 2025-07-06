"""Master GPT router for MONDAY."""
from ._utils.math import golden_rotation


def handler(request):
    """Return rotation for node 0 as demo."""
    return {"theta_0": golden_rotation(0)}
