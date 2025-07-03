import { birthdateToNode } from '../index';

test('deterministic node for epoch', () => {
  expect(birthdateToNode(new Date('1970-01-01'))).toBe(1);
});
