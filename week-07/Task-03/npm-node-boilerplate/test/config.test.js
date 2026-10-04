const assert = require('node:assert/strict');
const test = require('node:test');

const { getConfig } = require('../src/index');

test('loads safe default configuration', () => {
  const config = getConfig();

  assert.equal(typeof config.appName, 'string');
  assert.equal(typeof config.environment, 'string');
  assert.ok(Number.isInteger(config.port));
});
