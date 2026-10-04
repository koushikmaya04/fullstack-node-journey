# Week 07 - Task 01: Node.js Runtime & Core Modules

## Objective
Build two applications using only Node.js core modules:
1. Log Analyzer CLI - stream a large log file and count ERROR, WARN, and INFO lines.
2. Raw HTTP Server - use the built-in http module to serve JSON from multiple routes.

## Concepts Covered
- Node.js runtime and non-blocking I/O
- fs, path, os, events, readline
- Readable streams and line-by-line processing
- Buffers and the process object
- Raw HTTP request/response handling
- JSON responses, headers, status codes, graceful shutdown

## Structure
```text
week-07/Task-01/
├── README.md
├── log-analyzer-cli/
│   ├── analyzer.js
│   ├── sample.log
│   └── analyzer.test.js
└── raw-http-server/
    ├── server.js
    └── server.test.js
```

## Log Analyzer CLI
The analyzer uses fs.createReadStream() and readline.createInterface(), so the complete log is not loaded into memory.

Run:
```bash
node week-07/Task-01/log-analyzer-cli/analyzer.js week-07/Task-01/log-analyzer-cli/sample.log
```

Expected output includes ERROR, WARN, INFO, and TOTAL counts.

## Raw HTTP Server
The server uses only the built-in http module.

Run:
```bash
node week-07/Task-01/raw-http-server/server.js
```

Routes:
- GET /health
- GET /users
- GET /posts

Unknown routes return JSON with 404. Unsupported methods return 405.

## Core Module Notes
- fs: non-blocking file streaming.
- path: resolving and normalizing the log path.
- os: platform and CPU information.
- events: completion event emitted by the analyzer.
- readline: line-by-line stream processing.
- buffers: Buffer.byteLength() for HTTP response size.
- process: CLI arguments, environment variables, signals, and exit codes.

## Non-blocking I/O
The log analyzer deliberately avoids readFileSync(). A readable stream feeds readline incrementally, which keeps memory usage bounded for large files.

## Tests
Both exercises use Node's built-in test runner; no third-party packages are required.

```bash
node --test week-07/Task-01/log-analyzer-cli/analyzer.test.js week-07/Task-01/raw-http-server/server.test.js
```

## Learning Outcome
Node's core APIs provide the primitives behind higher-level frameworks. Understanding streams, the event-driven runtime, HTTP, buffers, and process lifecycle makes Express and NestJS behavior easier to reason about.