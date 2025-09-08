export function verifyWALDeterminism(
  chainA: Uint8Array,
  chainB: Uint8Array
): boolean {
  if (chainA.length !== chainB.length) return false;
  for (let i = 0; i < chainA.length; i++) {
    if (chainA[i] !== chainB[i]) return false;
  }
  return true;
}
