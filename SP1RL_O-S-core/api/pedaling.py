"""Pedal stroke handler."""
from ._utils.pw import mint_pw


def handler(request):
    strokes = request.get("strokes", 1)
    return {"minted": mint_pw(strokes)}
