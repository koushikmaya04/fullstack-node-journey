
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");

function analyzeLog(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);

  const counts = {
    ERROR: 0,
    WARN: 0,
    INFO: 0,
    TOTAL: lines.length,
  };

  for (const line of lines) {
    const match = line.match(/^\s*(ERROR|WARN|INFO)\b/i);

    if (match) {
      counts[match[1].toUpperCase()]++;
    }
  }

  return counts;
}

function formatReport(filePath, counts) {
  return `
Log analysis: ${path.basename(filePath)}
Platform: ${os.platform()}
CPU cores: ${os.cpus().length}
ERROR: ${counts.ERROR}
WARN: ${counts.WARN}
INFO: ${counts.INFO}
TOTAL: ${counts.TOTAL}
`;
}

function main() {
  const input = process.argv[2];

  if (!input) {
    console.error("Usage: node analyzer.js <log-file>");
    process.exitCode = 1;
    return;
  }

  const filePath = path.resolve(input);

  try {
    const counts = analyzeLog(filePath);
    console.log(formatReport(filePath, counts));
  } catch (error) {
    console.error("Unable to analyze file:", error.message);
    process.exitCode = 1;
  }
}

main();

module.exports = {
  analyzeLog,
  formatReport,
};
