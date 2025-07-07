#!/usr/bin/env bash
set -euo pipefail
REPO=${1:-$(pwd)}
echo "Simulating Golden-Angle diff"
mkdir -p /tmp/faux_repo
cd /tmp/faux_repo
git init -q
cp -r "$REPO"/* .
act -j count-diff || echo "(offline)"
