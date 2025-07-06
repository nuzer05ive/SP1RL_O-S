"""Daily report handler returning math snapshot and node-flavored poem."""
from ._utils.math import build_snapshot
from ._utils.narrative import compose
from .lens import get_active_node


def handler(request):
    user = request.get("user", "anon")
    node = get_active_node()
    snap = build_snapshot(user)
    story = compose(snap, node)
    return {"math": snap, "story": story}
