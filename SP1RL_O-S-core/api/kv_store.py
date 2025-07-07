"""Simple KV adapter using in-memory dict when MINIFLARE=1."""

import os

_store = {}


def put(key: str, value: str) -> None:
    if os.getenv("MINIFLARE"):
        _store[key] = value
    else:
        pass  # real KV call would go here


def get(key: str) -> str | None:
    if os.getenv("MINIFLARE"):
        return _store.get(key)
    return None
