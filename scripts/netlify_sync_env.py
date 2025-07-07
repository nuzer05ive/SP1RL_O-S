"""Sync workflow and config placeholders to Netlify env vars."""

from __future__ import annotations

import os
import re
from pathlib import Path

import requests
try:
    import tomli  # type: ignore
except ModuleNotFoundError:
    import subprocess, sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "tomli"])
    import tomli
from requests.exceptions import RequestException

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


def sync_to_netlify(site_id: str, token: str, vars: set[str]) -> bool:
    if not vars:
        print("No env vars found")
        return True
    payload = [
        {"key": name, "values": [{"value": os.getenv(name, ""), "context": "all"}]}
        for name in sorted(vars)
    ]
    url = f"https://api.netlify.com/api/v1/sites/{site_id}/env"
    for attempt in range(3):
        try:
            resp = requests.put(
                url,
                json=payload,
                headers={"Authorization": f"Bearer {token}"},
                timeout=10,
            )
        except RequestException:
            if attempt == 2:
                raise
            continue
        if resp.status_code in (502, 503):
            if attempt == 2:
                resp.raise_for_status()
            continue
        break
    if resp.status_code == 404:
        print("Netlify site not found (404) – skipping")
        return True
    resp.raise_for_status()
    print(f"Synced {len(payload)} vars")
    return False


def main() -> int:
    token = os.getenv("NETLIFY_AUTH_TOKEN")
    site_id = os.getenv("NETLIFY_SITE_ID")
    skipped = False
    if not site_id or not token:
        print("\u26a0\ufe0f  Skipping Netlify env sync \u2013 missing credentials")
        skipped = True
    else:
        vars = collect_vars()
        skipped = sync_to_netlify(site_id, token, vars)
    print(f"::set-output name=skipped::{str(skipped).lower()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
