const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { createAnalyzer, formatReport } = require('./analyzer');

test('analyzes log levels line by line', async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'node-log-analyzer-'));
  const filePath = path.join(directory, 'test.log');
  fs.writeFileSync(filePath, [
    'INFO application started',
    'WARN slow request',
    'ERROR database failed',
    'INFO retrying',
    'warn lowercase level',
    'unclassified message',
  ].join('\n'));

  const analyzer = createAnalyzer();
  const result = await analyzer.analyze(filePath);
  assert.deepEqual(result, { ERROR: 1, WARN: 2, INFO: 2, TOTAL: 6 });
  fs.rmSync(directory, { recursive: true, force: true });
});

test('formats a readable report', () => {
  const report = formatReport('/tmp/example.log', { ERROR: 1, WARN: 2, INFO: 3, TOTAL: 6 });
  assert.match(report, /Log analysis: example\.log/);
  assert.match(report, /ERROR: 1/);
  assert.match(report, /TOTAL: 6/);
});