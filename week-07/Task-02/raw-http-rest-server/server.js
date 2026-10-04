#!/usr/bin/env node

const http = require('node:http');

const PORT = Number.parseInt(process.env.PORT || '3001', 10);

const users = [
  { id: 1, name: 'Asha' },
  { id: 2, name: 'Ravi' },
];

function sendJson(res, statusCode, payload, headers = {}) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  for (const [name, value] of Object.entries(headers)) {
    res.setHeader(name, value);
  }

  if (statusCode === 204) {
    res.end();
    return;
  }

  const body = JSON.stringify(payload);
  res.setHeader('Content-Length', Buffer.byteLength(body));
  res.end(body);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.setEncoding('utf8');

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      if (!body.trim()) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });

    req.on('error', reject);
  });
}

function createServer() {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const match = url.pathname.match(/^\/users(?:\/(\d+))?$/);
    const userId = match?.[1] ? Number(match[1]) : null;

    if (!match) {
      sendJson(res, 404, { error: 'Route not found' });
      return;
    }

    if (req.method === 'GET') {
      if (userId !== null) {
        const user = users.find((item) => item.id === userId);

        if (!user) {
          sendJson(res, 404, { error: 'User not found' });
          return;
        }

        sendJson(res, 200, user);
        return;
      }

      sendJson(res, 200, { data: users });
      return;
    }

    if (req.method === 'POST') {
      if (userId !== null) {
        sendJson(res, 400, { error: 'POST must target /users' });
        return;
      }

      try {
        const payload = await readJsonBody(req);

        if (typeof payload.name !== 'string' || !payload.name.trim()) {
          sendJson(res, 400, { error: 'name is required' });
          return;
        }

        const id = users.length ? Math.max(...users.map((user) => user.id)) + 1 : 1;
        const user = { id, name: payload.name.trim() };
        users.push(user);

        sendJson(res, 201, user, { Location: '/users/' + id });
      } catch (error) {
        sendJson(res, 400, { error: error.message });
      }

      return;
    }

    if (req.method === 'PUT') {
      if (userId === null) {
        sendJson(res, 400, { error: 'User id is required' });
        return;
      }

      const index = users.findIndex((user) => user.id === userId);

      if (index === -1) {
        sendJson(res, 404, { error: 'User not found' });
        return;
      }

      try {
        const payload = await readJsonBody(req);

        if (typeof payload.name !== 'string' || !payload.name.trim()) {
          sendJson(res, 400, { error: 'name is required' });
          return;
        }

        users[index] = { id: userId, name: payload.name.trim() };
        sendJson(res, 200, users[index]);
      } catch (error) {
        sendJson(res, 400, { error: error.message });
      }

      return;
    }

    if (req.method === 'DELETE') {
      if (userId === null) {
        sendJson(res, 400, { error: 'User id is required' });
        return;
      }

      const index = users.findIndex((user) => user.id === userId);

      if (index === -1) {
        sendJson(res, 404, { error: 'User not found' });
        return;
      }

      users.splice(index, 1);
      sendJson(res, 204);
      return;
    }

    sendJson(res, 405, { error: 'Method Not Allowed' }, {
      Allow: 'GET, POST, PUT, DELETE',
    });
  });
}

if (require.main === module) {
  const server = createServer();

  server.listen(PORT, () => {
    console.log('REST server listening on http://localhost:' + PORT);
  });

  const shutdown = (signal) => {
    console.log('Received ' + signal + '; shutting down...');
    server.close(() => process.exit(0));
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

module.exports = { createServer, sendJson, readJsonBody };
