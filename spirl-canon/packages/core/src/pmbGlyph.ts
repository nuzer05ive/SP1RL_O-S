export type PhiTick = { angleDeg: number; emphasis: boolean };

export function phiTicks(count = 144): PhiTick[] {
  const ticks: PhiTick[] = [];
  const goldenAngle = 137.5;
  for (let i = 0; i < count; i += 1) {
    const angleDeg = (i * goldenAngle) % 360;
    ticks.push({ angleDeg, emphasis: i % 5 === 0 });
  }
  return ticks;
}
