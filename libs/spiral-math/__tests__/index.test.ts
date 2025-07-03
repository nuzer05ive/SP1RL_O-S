import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import {
  birthdateToNode,
  phiMilestones,
  milestoneEvents,
  HarmonicEvent
} from '../index';

test('epoch date hits node 88', () => {
  expect(birthdateToNode(new Date('1970-01-01'))).toBe(88);
});

test('2000-01-01 is within range', () => {
  expect(birthdateToNode(new Date('2000-01-01'))).not.toBe(0);
});

test('phi milestone calculation', () => {
  const ms = phiMilestones(new Date('1970-01-01'), 1);
  expect(ms[0].date).toBe('1971-08-15');
});

test('milestone events picks nearby csv rows', () => {
  const csv = fs.readFileSync(
    path.join(__dirname, '../../../data/world_events.csv'),
    'utf8'
  );
  const events = parse(csv, { columns: true }) as HarmonicEvent[];
  const result = milestoneEvents(new Date('1970-01-01'), events, 1);
  expect(result[0].events.length).toBe(1);
  expect(result[0].events[0].title).toBe('Event near phi milestone');
});
