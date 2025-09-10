export function mathReceipt({ alpha = 37.5, eps = 0.03934, kappa = 1.12, phiTiltDeg = 0 } = {}) {
  return `α=${alpha}° | ε₃=${eps}→Δ≈${(180 * eps).toFixed(2)}° | θ′(κ=${kappa})≈8.35×10⁻⁷ rad | φ-tilt=${phiTiltDeg}°`;
}
