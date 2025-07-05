"""Canonical spiral time constants."""

from math import sqrt

PHI = (1 + sqrt(5)) / 2
# Node span in seconds
DELTA = 86400 / 89
# Quantum τ used for UI rounding
TAU = DELTA / 10
# Wobble scaling coefficient ensuring w0 ≈ 0.686 s
K = sqrt(5) / 10000
# Overlap coefficient φ⁻³
PSI = PHI ** -3

# Default onboarding arc end episode (φ^43 ≈ 221.8)
ONBOARDING_EPISODES = 221.8
