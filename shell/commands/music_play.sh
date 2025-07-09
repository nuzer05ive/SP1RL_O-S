#!/usr/bin/env bash
# Play the folded loop if sox is installed
FILE="$(dirname "$0")/../../apps/audio/music/fold_loop.wav"
if command -v play >/dev/null 2>&1; then
  play "$FILE"
else
  echo "Install sox to play audio: sudo apt-get install sox" >&2
fi
