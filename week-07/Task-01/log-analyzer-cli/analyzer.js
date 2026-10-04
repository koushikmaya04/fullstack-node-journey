#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { EventEmitter } = require('node:events');
const readline = require('node:readline');

const LEVELS = Object.freeze(['ERROR', 'WARN', 'INFO']);

function createAnalyzer() {
  const emitter = new EventEmitter();
  const counts = { ERROR: 0, WARN: 0, INFO: 0, TOTAL: 0 };

  function processLine(line) {
    counts.TOTAL += 1;
    const match = line.match(/^\s*(ERROR|WARN|INFO)\b/i);
    if (match) counts[match[1].toUpperCase()] += 1;
  }

  function analyze(filePath) {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
      stream.on('error', reject);
      const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
      rl.on('line', processLine);
      rl.on('close', () => {
        const result = Object.freeze({ ...counts });
        emitter.emit('complete', result);
        resolve(result);
      });
    });
  }

  return { analyze, on: (...args) => emitter.on(...args) };
}

function formatReport(filePath, counts) {
  return [
    'Log analysis: ' + path.basename(filePath),
    'Platform: ' + os.platform(),
    'CPU cores: ' + os.cpus().length,
    'ERROR: ' + counts.ERROR,
    'WARN: ' + counts.WARN,
    'INFO: ' + counts.INFO,
    'TOTAL: ' + counts.TOTAL,
  ].join('\n');
}

async function main() {
  const input = process.argv[2];
  if (!input) {
    console.error('Usage: node analyzer.js <log-file>');
    process.exitCode = 1;
    return;
  }

  const filePath = path.resolve(process.cwd(), input);
  const analyzer = createAnalyzer();
  analyzer.on('complete', (counts) => console.log(formatReport(filePath, counts)));

  try {
    await analyzer.analyze(filePath);
  } catch (error) {
    console.error('Unable to analyze ' + filePath + ': ' + error.message);
    process.exitCode = 1;
  }
}

if (require.main === module) main();

module.exports = { createAnalyzer, formatReport, LEVELS };