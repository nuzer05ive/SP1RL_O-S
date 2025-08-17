#!/usr/bin/env bash
set -euo pipefail
LEDGER="SP1RL_O-S-core/codex/captain_mints/data/ledger.json"
TMP="$(mktemp)"
jq '.m += 1
    | .items += [{"m":.m,"kappa":0.000437,"score":0.73}]
    | if (.items[-1].score >= 0.72)
      then .treasury += [.items[-1]]
      else . end' "$LEDGER" > "$TMP"
mv "$TMP" "$LEDGER"
echo "✓ minted (#$(jq -r '.m' $LEDGER)) κ=0.000437"
