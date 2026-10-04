const assert = require('node:assert/strict');
const http = require('node:http');
const test = require('node:test');
const { createServer } = require('./server');

function request(server, path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const address = server.address();
    const req = http.request({ hostname: '127.0.0.1', port: address.port, path, method }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: JSON.parse(body) }));
    });
    req.on('error', reject);
    req.end();
  });
}

test('serves JSON from /health with headers', async (t) => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  t.after(() => server.close());
  const response = await request(server, '/health');
  assert.equal(response.statusCode, 200);
  assert.equal(response.headers['content-type'], 'application/json; charset=utf-8');
  assert.equal(response.headers['cache-control'], 'no-store');
  assert.deepEqual(response.body, { status: 'ok' });
});

test('serves users and returns 404 for unknown routes', async (t) => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  t.after(() => server.close());
  const usersResponse = await request(server, '/users');
  const missingResponse = await request(server, '/missing');
  assert.equal(usersResponse.statusCode, 200);
  assert.equal(usersResponse.body.data.length, 2);
  assert.equal(missingResponse.statusCode, 404);
  assert.deepEqual(missingResponse.body, { error: 'Route not found' });
});

test('rejects unsupported methods', async (t) => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  t.after(() => server.close());
  const response = await request(server, '/health', 'POST');
  assert.equal(response.statusCode, 405);
  assert.deepEqual(response.body, { error: 'Method Not Allowed' });
});