import { birthdateToNode } from '../index';

test('deterministic node for epoch', () => {
  expect(birthdateToNode(new Date('1970-01-01'))).toBe(88);
});

test('2000-01-01 is within range', () => {
  expect(birthdateToNode(new Date('2000-01-01'))).not.toBe(0);
});
