import assert from 'node:assert/strict';
import { once } from 'node:events';
import test from 'node:test';
import bcrypt from 'bcrypt';
import app from '../src/app.js';
import UsersDAO from '../src/dao/users.dao.js';

async function withRegistrationRequest(t, { body, existingUsers = [] }) {
  const storedUsers = [...existingUsers];
  const originalFindByEmail = UsersDAO.findByEmail;
  const originalCreate = UsersDAO.create;

  UsersDAO.findByEmail = async (email) =>
    storedUsers.find((user) => user.email === email) ?? null;
  UsersDAO.create = async (userData) => {
    const user = { id: 'test-user-id', ...userData, role: 'user' };
    storedUsers.push(user);
    return user;
  };

  t.after(() => {
    UsersDAO.findByEmail = originalFindByEmail;
    UsersDAO.create = originalCreate;
  });

  const server = app.listen(0);
  t.after(
    () =>
      new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      })
  );
  await once(server, 'listening');

  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/api/sessions/register`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

  return { response, storedUsers };
}

const validUser = {
  first_name: 'Ana',
  last_name: 'Pérez',
  email: ' Ana@Mail.com ',
  password: 'una-clave-segura',
};

test('registers a user with normalized email and default role', async (t) => {
  const { response, storedUsers } = await withRegistrationRequest(t, {
    body: { ...validUser, role: 'admin' },
  });

  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), {
    status: 'success',
    payload: {
      id: 'test-user-id',
      first_name: 'Ana',
      last_name: 'Pérez',
      email: 'ana@mail.com',
      role: 'user',
    },
  });
  assert.equal(storedUsers[0].email, 'ana@mail.com');
  assert.equal(storedUsers[0].role, 'user');
});

test('rejects missing registration fields', async (t) => {
  const { response } = await withRegistrationRequest(t, {
    body: { first_name: 'Ana' },
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    status: 'error',
    message: 'Faltan campos obligatorios',
  });
});

test('rejects an invalid email', async (t) => {
  const { response } = await withRegistrationRequest(t, {
    body: { ...validUser, email: 'invalid-email' },
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    status: 'error',
    message: 'Faltan campos obligatorios',
  });
});

test('rejects a registered email with HTTP 409', async (t) => {
  const { response } = await withRegistrationRequest(t, {
    body: validUser,
    existingUsers: [{ email: 'ana@mail.com' }],
  });

  assert.equal(response.status, 409);
  assert.deepEqual(await response.json(), {
    status: 'error',
    message: 'El email ya está registrado',
  });
});

test('does not include a password in the registration response', async (t) => {
  const { response } = await withRegistrationRequest(t, { body: validUser });
  const result = await response.json();

  assert.equal('password' in result.payload, false);
});

test('stores a bcrypt hash instead of the plain-text password', async (t) => {
  const { storedUsers } = await withRegistrationRequest(t, { body: validUser });
  const storedPassword = storedUsers[0].password;

  assert.notEqual(storedPassword, validUser.password);
  assert.equal(await bcrypt.compare(validUser.password, storedPassword), true);
});
