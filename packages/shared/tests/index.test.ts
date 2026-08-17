import assert from 'node:assert/strict';
import test from 'node:test';
import { HOSTS, PRODUCT_NAME } from '../src/index';

test('product name', () => {
  assert.equal(PRODUCT_NAME, 'getPersona.md');
});

test('hosts', () => {
  assert.equal(HOSTS.api, 'api.getpersona.md');
});
