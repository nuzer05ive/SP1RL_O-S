import { birthdateToNode, calcHarmonicEvents } from '../../libs/spiral-math';
import Mustache from 'mustache';
import OpenAI from 'openai-edge';
import Redis from 'ioredis-edge';
import { parse } from 'csv-parse/sync';
import letterTemplate from '../../templates/letter.hbs?raw';
import eventsCSV from '../../data/world_events.csv?raw';
import factsMD from '../../docs/spiral-facts.md?raw';

const openai = new OpenAI(process.env.OPENAI_API_KEY!);
const redis = new Redis(process.env.REDIS_URL!);
const events = parse(eventsCSV, { columns: true });
const facts = factsMD
  .split('\n')
  .filter(l => l.startsWith('-'))
  .map(l => l.replace(/^\-\s*/, ''));

export default async (req: Request) => {
  const ip = req.headers.get('x-forwarded-for') ?? 'local';
  const hits = await redis.incr(`rate:${ip}`);
  await redis.expire(`rate:${ip}`, 10);
  if (hits > 5) {
    return new Response('Whoa, slow down, the spiral needs time to breathe!', {
      status: 429
    });
  }
  const url = new URL(req.url);
  const bd = url.searchParams.get('birthdate');
  if (!bd) return new Response('birthdate required', { status: 400 });

  const key = `letter:${bd}`;
  const cached = await redis.get(key);
  if (cached) return new Response(cached, { status: 200 });

  const node = birthdateToNode(new Date(bd));
  const evWin = calcHarmonicEvents(new Date(bd), events);
  const fact = facts[Math.floor(Math.random() * facts.length)];
  const prompt = Mustache.render(letterTemplate, { node, events: evWin, fact });

  const ai = await openai.chat.completions.create({
    model: 'gpt-4o-mini-preview',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7
  });
  const letter = ai.choices[0].message!.content!;
  await redis.set(key, letter, 'EX', 60 * 60 * 24 * 30);
  return new Response(letter, { status: 200 });
};
