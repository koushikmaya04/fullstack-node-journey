const http = require('node:http');

const PORT = 3001;

const users = [
  { id: 1, name: 'Asha' },
  { id: 2, name: 'Ravi' },
];

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');

  if (statusCode === 204) {
    res.end();
    return;
  }

  const body = JSON.stringify(data);
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
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
    const userId = match ? Number(match[1]) : null;

    if (!match) {
      sendJson(res, 404, { error: 'Route not found' });
      return;
    }

    // GET /users or GET /users/:id
    if (req.method === 'GET') {
      if (userId !== null) {
        const user = users.find((user) => user.id === userId);

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

    // POST /users
    if (req.method === 'POST') {
      if (userId !== null) {
        sendJson(res, 400, { error: 'POST must use /users' });
        return;
      }

      try {
        const data = await readBody(req);

        if (!data.name || typeof data.name !== 'string') {
          sendJson(res, 400, { error: 'name is required' });
          return;
        }

        const id = users.length
          ? Math.max(...users.map((user) => user.id)) + 1
          : 1;

        const user = {
          id,
          name: data.name.trim(),
        };

        users.push(user);

        sendJson(res, 201, user);
      } catch (error) {
        sendJson(res, 400, { error: error.message });
      }

      return;
    }

    // PUT /users/:id
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
        const data = await readBody(req);

        if (!data.name || typeof data.name !== 'string') {
          sendJson(res, 400, { error: 'name is required' });
          return;
        }

        users[index] = {
          id: userId,
          name: data.name.trim(),
        };

        sendJson(res, 200, users[index]);
      } catch (error) {
        sendJson(res, 400, { error: error.message });
      }

      return;
    }

    // DELETE /users/:id
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

    sendJson(res, 400, { error: 'Method not supported' });
  });
}

const server = createServer();

server.listen(PORT, () => {
  console.log(`REST server running at http://localhost:${PORT}`);
});
