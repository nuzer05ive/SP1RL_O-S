import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT / "SP1RL_O-S-core"))

from api import auth, kv_store


def test_miniflare_kv():
    os.environ["MINIFLARE"] = "1"
    kv_store.put("a", "1")
    assert kv_store.get("a") == "1"
    del os.environ["MINIFLARE"]


def test_check_env(monkeypatch):
    monkeypatch.delenv("FOO", raising=False)
    try:
        auth.check_env(["FOO"])
    except SystemExit as e:
        assert e.code == 503
    else:
        assert False, "expected SystemExit"
