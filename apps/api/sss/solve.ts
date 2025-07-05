import { solveSpiralTime } from '../../../libs/spiral-time-ts';

export default async (req: Request) => {
  const url = new URL(req.url);
  const date = url.searchParams.get('date') || '1970-01-01';
  const sParam = url.searchParams.get('S');
  const S = sParam ? parseInt(sParam, 10) : undefined;
  const result = solveSpiralTime(date, S);
  return new Response(JSON.stringify({
    clock: result.clock_str,
    node: result.node,
    lap: result.lap,
    mu: result.mu,
    dt: result.t_seconds,
    episode: result.episode
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
