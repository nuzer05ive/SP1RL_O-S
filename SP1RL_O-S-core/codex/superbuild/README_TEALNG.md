TEAL.Ng — Harmonic Next-Moment Planner
--------------------------------------
Objective:
  Choose the next small action (module focus + κ nudge + ring micro-rotations + dt) that maximizes:
    TEAL calm (Δ″,Δ‴ stable) + ZCM zero-net + 3-body equilibrium, while minimizing jerk and keeping novelty.
Math (concise):
  • TEAL := I(|zMAD(Δ″)|≤Z && |zMAD(Δ‴)|≤Z && jerk < median)
  • ZCM  := 1 - E, E = norm(|Δ″|+|Δ‴|) over window
  • 3BP  := 1 - (λ1·θ(outer,mid) + λ2·θ(mid,inner) + λ3·θ(outer,inner)) / π
  • total := w_t·TEAL + w_z·ZCM + w_3·3BP - w_j·penalty + w_n·novelty  ∈ [0,1]
Search:
  φ-low-discrepancy sampler over (module, δκ, δθ, dt), beam keep topK, depth 2 by default, dt ≈ 700 ms.
Hooks:
  - “Plan” button: single-shot
  - “Auto‑TEAL”: re-plan after each fire ! and whenever calm corridor is detected
Notes:
  Pure frontend. Worker keeps UI smooth. Configurable in config/teal_ng_config.json or Settings.
