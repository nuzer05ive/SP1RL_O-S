import json, re
import pytest
from spirl_ghost import codex

def test_load_in_missing_keys_raises():
    bad_input = {
        "glyphs": [], "beats": [], "pairs": [], "switchARoo": False, "meta": {}
    }
    with pytest.raises(KeyError) as e:
        codex.load(bad_input)
    assert "canon" in str(e.value)

def test_seal_creates_ledger_and_hashes(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)
    outputs = {"A": "alpha", "B": "beta"}
    addr_seed = 12345
    result = codex.seal(outputs, addr_seed)

    assert set(result) == {"prime_address", "build_hash", "ledger_hash"}
    hex_re = re.compile(r"^[0-9a-f]+$")
    assert all(hex_re.match(v) for v in result.values())

    ledger_file = tmp_path / ".ledger" / "ledger.jsonl"
    last_line = json.loads(ledger_file.read_text().splitlines()[-1])
    assert last_line["prime_address"] == result["prime_address"]
    assert last_line["build_hash"] == result["build_hash"]
