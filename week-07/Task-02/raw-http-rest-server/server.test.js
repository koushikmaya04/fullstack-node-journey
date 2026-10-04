const assert = require('node:assert/strict');
const http = require('node:http');
const test = require('node:test');
const { createServer } = require('./server');

function request(server, path, method = 'GET', payload) {
  return new Promise((resolve, reject) => {
    const address = server.address();
    const body = payload === undefined ? undefined : JSON.stringify(payload);

    const req = http.request({
      hostname: '127.0.0.1',
      port: address.port,
      path,
      method,
      headers: body
        ? {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
          }
        : undefined,
    }, (res) => {
      let responseBody = '';

      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: responseBody ? JSON.parse(responseBody) : null,
        });
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(body);
    }

    req.end();
  });
}

async function startServer(t) {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  t.after(() => server.close());
  return server;
}

test('GET /users returns 200 and JSON headers', async (t) => {
  const server = await startServer(t);
  const response = await request(server, '/users');

  assert.equal(response.statusCode, 200);
  assert.equal(response.headers['content-type'], 'application/json; charset=utf-8');
  assert.equal(response.headers['cache-control'], 'no-store');
  assert.equal(response.body.data.length, 2);
});

test('GET /users/:id returns a single resource', async (t) => {
  const server = await startServer(t);
  const response = await request(server, '/users/1');

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.body, { id: 1, name: 'Asha' });
});

test('POST /users returns 201 Created', async (t) => {
  const server = await startServer(t);
  const response = await request(server, '/users', 'POST', { name: 'Meera' });

  assert.equal(response.statusCode, 201);
  assert.equal(response.body.name, 'Meera');
  assert.ok(response.headers.location);
});

test('PUT /users/:id returns 200 OK', async (t) => {
  const server = await startServer(t);
  const response = await request(server, '/users/1', 'PUT', { name: 'Asha Updated' });

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.body, { id: 1, name: 'Asha Updated' });
});

test('DELETE /users/:id returns 204 No Content', async (t) => {
  const server = await startServer(t);
  const response = await request(server, '/users/2', 'DELETE');

  assert.equal(response.statusCode, 204);
  assert.equal(response.body, null);
});

test('invalid input returns 400 Bad Request', async (t) => {
  const server = await startServer(t);
  const response = await request(server, '/users', 'POST', {});

  assert.equal(response.statusCode, 400);
  assert.equal(response.body.error, 'name is required');
});

test('missing resource returns 404 Not Found', async (t) => {
  const server = await startServer(t);
  const response = await request(server, '/users/999');

  assert.equal(response.statusCode, 404);
  assert.equal(response.body.error, 'User not found');
});

test('unsupported method returns 405 and Allow header', async (t) => {
  const server = await startServer(t);
  const response = await request(server, '/users', 'PATCH');

  assert.equal(response.statusCode, 405);
  assert.equal(response.headers.allow, 'GET, POST, PUT, DELETE');
});
