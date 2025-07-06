"""Yin/Yang vote handler."""

def handler(request):
    vote = request.get("vote")
    return {"received": vote}
