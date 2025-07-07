"""Sync workflow and config placeholders to Netlify env vars."""

from __future__ import annotations

import os
import re
from pathlib import Path

import requests
import tomli

PATTERN = re.compile(r"{{\s*\$([A-Z0-9_]+)\s*}}")


def scan_file(path: Path) -> set[str]:
    try:
        text = path.read_text()
    except Exception:
        return set()
    if path.suffix == ".toml":
        try:
            text = str(tomli.loads(text))
        except tomli.TOMLDecodeError:
            pass
    return set(PATTERN.findall(text))


def collect_vars() -> set[str]:
    vars: set[str] = set()
    for ext in ("*.yml", "*.yaml", "*.toml"):
        for p in Path(".").rglob(ext):
            vars.update(scan_file(p))
    return vars


def sync_to_netlify(site_id: str, token: str, vars: set[str]) -> int:
    if not vars:
        print("No env vars found")
        return 0
    payload = [
        {"key": name, "values": [{"value": os.getenv(name, ""), "context": "all"}]}
        for name in sorted(vars)
    ]
    url = f"https://api.netlify.com/api/v1/sites/{site_id}/env"
    resp = requests.put(url, json=payload, headers={"Authorization": f"Bearer {token}"})
    if resp.status_code == 404:
        print("Netlify site not found (404) – skipping")
        return 0
    resp.raise_for_status()
    print(f"Synced {len(payload)} vars")
    return 0


def main() -> int:
    token = os.getenv("NETLIFY_AUTH_TOKEN")
    site_id = os.getenv("NETLIFY_SITE_ID")
    if not token or not site_id:
        print("NETLIFY credentials missing – skipping")
        return 0
    vars = collect_vars()
    return sync_to_netlify(site_id, token, vars)


if __name__ == "__main__":
    raise SystemExit(main())
