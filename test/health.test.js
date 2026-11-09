import assert from 'node:assert/strict';
import { once } from 'node:events';
import test from 'node:test';
import app from '../src/app.js';

test('GET /api/health returns the server health response', async (t) => {
  const server = app.listen(0);
  t.after(
    () =>
      new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      })
  );

  await once(server, 'listening');

  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/api/health`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    status: 'ok',
    message: 'Servidor activo',
  });
});
