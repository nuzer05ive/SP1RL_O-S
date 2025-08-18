# Ghost Console

This directory hosts a minimal operator panel for observing and steering the `SP1RL_Ghost`.
It exposes a deterministic client side state store, a command dispatcher and a light UI overlay.

## Files
- `webapp_vr/src/console/state.ts` – Zustand store holding `GhostConsoleState`.
- `webapp_vr/src/console/commands.ts` – JSON command dispatcher updating state.
- `webapp_vr/src/console/GhostConsole.tsx` – React overlay with a basic status bar and `fire` button.
- `webapp_vr/src/routes/VRPortal.tsx` – wires the console into the VR scene.

This is only a scaffold based on the full specification; additional panels, gates and persistence may be implemented incrementally.
