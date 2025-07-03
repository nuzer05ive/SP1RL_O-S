import { differenceInCalendarDays } from 'date-fns';

export const PHI = (1 + Math.sqrt(5)) / 2;

export function birthdateToNode(bd: Date): number {
  const julian = differenceInCalendarDays(bd, new Date('1970-01-01'));
  const n = Math.floor(Math.pow(PHI, julian) % 88) + 1;
  return n;
}

export interface HarmonicEvent {
  date: string;
  title: string;
  locale: string;
}

export function calcHarmonicEvents(bd: Date, events: HarmonicEvent[]): HarmonicEvent[] {
  const window = [-1, 0, 1].map(d =>
    new Date(bd.getTime() + d * 86400000).toISOString().substring(0, 10)
  );
  return events.filter(ev => window.includes(ev.date));
}
