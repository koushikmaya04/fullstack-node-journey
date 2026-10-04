#!/usr/bin/env node

const http = require('node:http');
const PORT = Number.parseInt(process.env.PORT || '3000', 10);

const users = [
  { id: 1, name: 'Asha' },
  { id: 2, name: 'Ravi' },
];
const posts = [
  { id: 1, title: 'Learning Node.js', authorId: 1 },
  { id: 2, title: 'Understanding streams', authorId: 2 },
];

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Length', Buffer.byteLength(body));
  res.end(body);
}

function createServer() {
  return http.createServer((req, res) => {
    if (req.method !== 'GET') {
      sendJson(res, 405, { error: 'Method Not Allowed' });
      return;
    }
    switch (req.url) {
      case '/health': sendJson(res, 200, { status: 'ok' }); break;
      case '/users': sendJson(res, 200, { data: users }); break;
      case '/posts': sendJson(res, 200, { data: posts }); break;
      default: sendJson(res, 404, { error: 'Route not found' });
    }
  });
}

if (require.main === module) {
  const server = createServer();
  server.listen(PORT, () => console.log('Raw HTTP server listening on http://localhost:' + PORT));

  const shutdown = (signal) => {
    console.log('Received ' + signal + '; shutting down...');
    server.close(() => process.exit(0));
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

module.exports = { createServer, sendJson };