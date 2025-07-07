"""Sync .env.example with Netlify site environment variables."""

from __future__ import annotations

import os
import sys
from pathlib import Path

import requests
from tabulate import tabulate


def load_env_example(path: Path) -> dict[str, str]:
    env = {}
    for line in path.read_text().splitlines():
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            continue
        key, val = line.split("=", 1)
        env[key] = val
    return env


def get_netlify_vars(site_id: str, token: str) -> dict[str, str]:
    url = f"https://api.netlify.com/api/v1/sites/{site_id}/env"
    resp = requests.get(url, headers={"Authorization": f"Bearer {token}"})
    resp.raise_for_status()
    data = resp.json()
    return {item["key"]: item["values"][0]["value"] for item in data}


def create_or_update(
    site_id: str, token: str, key: str, value: str, existing: dict[str, str]
):
    base = f"https://api.netlify.com/api/v1/sites/{site_id}/env"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    if key in existing:
        if existing[key] == value:
            return "unchanged"
        resp = requests.put(f"{base}/{key}", headers=headers, json={"value": value})
        resp.raise_for_status()
        return "updated"
    resp = requests.post(base, headers=headers, json={"key": key, "value": value})
    resp.raise_for_status()
    return "added"


def main() -> int:
    token = os.environ.get("NETLIFY_AUTH_TOKEN")
    site_id = os.environ.get("NETLIFY_SITE_ID")
    if not token or not site_id:
        print("NETLIFY_AUTH_TOKEN and NETLIFY_SITE_ID are required", file=sys.stderr)
        return 1

    env_path = Path(".env.example")
    local = load_env_example(env_path)
    remote = get_netlify_vars(site_id, token)

    rows = []
    for key, val in local.items():
        action = create_or_update(site_id, token, key, val, remote)
        rows.append([key, action])

    print(tabulate(rows, headers=["Key", "Action"]))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
