const test = require('node:test');
const assert = require('node:assert');
const { primeAddress } = require('../packages/core/src/address.js');

test('primeAddress creates human string', () => {
  const addr = primeAddress(5, 34, 1);
  assert.ok(addr.human.includes('5'));
});
