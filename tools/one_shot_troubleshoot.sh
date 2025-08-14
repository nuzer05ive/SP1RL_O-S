#!/usr/bin/env bash
set -euo pipefail

echo "== ENV CHECKS =="; python3 -V || true; node -v || true; npm -v || true

echo "== PY TESTS =="; pytest -q || (echo "[FAIL] pytest red"; exit 1)

echo "== WEB BUILD =="
if [ -f package.json ]; then npm ci && npm run build || true; fi

echo "== LOG SCAN =="
( ls -1 logs/*.log 2>/dev/null || true ) | while read -r f; do
  echo "-- $f --"; tail -n 80 "$f" | sed -e 's/\x1b\[[0-9;]*m//g' | grep -i -E "error|fail|traceback" || true

done

echo "== A-FRAME SMOKE =="
test -f web/aframe/phi_studio.html || { echo "Missing A-Frame studio"; exit 1; }

echo "== REPORT =="
echo "OK if all sections above passed without [FAIL]."

echo "---- npm env ----"
node -v || true
npm -v || true
npm config get registry || true
npm ping || true
echo "---- try install ----"
cd webapp || exit 1
npm ci || npm install
npx vite --version || echo "vite not found"
