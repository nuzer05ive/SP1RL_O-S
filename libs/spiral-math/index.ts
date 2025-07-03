import { differenceInCalendarDays } from 'date-fns';

export const PHI = (1 + Math.sqrt(5)) / 2;

export function birthdateToNode(bd: Date): number {
  const julian = differenceInCalendarDays(bd, new Date('1970-01-01'));
  const raw = Math.floor(Math.pow(PHI, julian) % 88);
  // Map 0 ↦ 88 to keep 1-88 inclusive
  return raw === 0 ? 88 : raw;
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

export interface PhiMilestone {
  n: number;
  date: string;
}

export function phiMilestones(bd: Date, steps = 12): PhiMilestone[] {
  const out: PhiMilestone[] = [];
  for (let i = 1; i <= steps; i++) {
    const days = Math.round(Math.pow(PHI, i) * 365.25);
    const date = new Date(bd.getTime() + days * 86400000)
      .toISOString()
      .substring(0, 10);
    out.push({ n: i, date });
  }
  return out;
}

export function milestoneEvents(
  bd: Date,
  events: HarmonicEvent[],
  steps = 12
): { milestone: PhiMilestone; events: HarmonicEvent[] }[] {
  const milestones = phiMilestones(bd, steps);
  return milestones.map(m => ({
    milestone: m,
    events: calcHarmonicEvents(new Date(m.date), events)
  }));
}
