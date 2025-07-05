import { solveSpiralTime, getJulianDay } from '../../../libs/spiral-time-ts';

export default async (req: Request) => {
  const url = new URL(req.url);
  const date = url.searchParams.get('date') || '1970-01-01';
  const sParam = url.searchParams.get('S');
  const S = sParam ? parseInt(sParam, 10) : getJulianDay(date);
  const result = solveSpiralTime(S);
  return new Response(JSON.stringify({
    clock: result.clock,
    node: result.node,
    lap: result.lap,
    μ: result.μ,
    seconds: result.seconds,
    τ_multiple: result.τ_multiple
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
