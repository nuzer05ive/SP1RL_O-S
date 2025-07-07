#!/usr/bin/env bash
# One-shot local sync of .env.example → Netlify
set -euo pipefail
[[ -z "${NETLIFY_AUTH_TOKEN:-}" || -z "${NETLIFY_SITE_ID:-}" ]] && \
  { echo "Set NETLIFY_AUTH_TOKEN & NETLIFY_SITE_ID"; exit 1; }

while IFS='=' read -r KEY VAL; do
  [[ "$KEY" =~ ^#|^$ ]] && continue
  if netlify env:get "$KEY" --auth "$NETLIFY_AUTH_TOKEN" \
                           --site "$NETLIFY_SITE_ID" >/dev/null 2>&1; then
    continue  # already set
  fi
  if [[ "$VAL" == "AUTO" ]]; then
    VAL=$(openssl rand -hex 32)
  fi
  netlify env:set "$KEY" "$VAL" \
    --auth "$NETLIFY_AUTH_TOKEN" --site "$NETLIFY_SITE_ID"
done < .env.example
