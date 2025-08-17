Captain Mints — Modular Extras
------------------------------
Modules are declared in codex/_registry/manifest.json.
Each module provides a stable ESM entry; update 'entry' to swap implementation without touching the app.

Add a new math kernel:
 1) drop file at codex/captain_mints/mod/teal_math.v2.js
 2) add a new record in manifest.json with id "teal-math@canary" and entry path
 3) users can prefer canary via in-app Prefs; otherwise stable loads by default
