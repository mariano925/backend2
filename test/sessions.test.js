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
    const user = { _id: 'test-user-id', ...userData, role: 'user' };
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

async function withAuthenticationServer(t) {
  const password = 'una-clave-segura';
  const user = {
    _id: 'authenticated-user-id',
    first_name: 'Ana',
    last_name: 'Pérez',
    email: 'ana@mail.com',
    password: await bcrypt.hash(password, 4),
    role: 'user',
  };
  const originalFindByEmail = UsersDAO.findByEmail;
  const originalFindById = UsersDAO.findById;

  UsersDAO.findByEmail = async (email) =>
    email === user.email ? user : null;
  UsersDAO.findById = async (id) =>
    String(id) === String(user._id) ? user : null;

  t.after(() => {
    UsersDAO.findByEmail = originalFindByEmail;
    UsersDAO.findById = originalFindById;
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
  return {
    baseUrl: `http://127.0.0.1:${port}`,
    password,
    user,
  };
}

function getSessionCookie(response) {
  const setCookie = response.headers.get('set-cookie');
  assert.ok(setCookie, 'expected a currentUser cookie');
  assert.match(setCookie, /^currentUser=/);
  assert.match(setCookie, /(?:^|;\s*)httponly(?:;|$)/i);
  return setCookie.split(';', 1)[0];
}

async function postLogin(baseUrl, password) {
  return fetch(`${baseUrl}/api/sessions/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'ana@mail.com', password }),
  });
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
    message: 'El email no es válido',
  });
});

test('rejects a password shorter than 8 characters', async (t) => {
  const { response } = await withRegistrationRequest(t, {
    body: { ...validUser, password: 'short' },
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    status: 'error',
    message: 'La contraseña debe tener al menos 8 caracteres',
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

test('logs in successfully and sets an HttpOnly currentUser cookie', async (t) => {
  const { baseUrl, password } = await withAuthenticationServer(t);
  const response = await postLogin(baseUrl, password);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    status: 'success',
    message: 'Login correcto',
  });
  getSessionCookie(response);
});

test('rejects login with invalid credentials', async (t) => {
  const { baseUrl } = await withAuthenticationServer(t);
  const response = await postLogin(baseUrl, 'contraseña-incorrecta');

  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), {
    status: 'error',
    message: 'Credenciales inválidas',
  });
});

test('returns only public user fields for a valid currentUser cookie', async (t) => {
  const { baseUrl, password, user } = await withAuthenticationServer(t);
  const loginResponse = await postLogin(baseUrl, password);
  const cookie = getSessionCookie(loginResponse);
  const response = await fetch(`${baseUrl}/api/sessions/current`, {
    headers: { cookie },
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    status: 'success',
    payload: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
});

test('rejects current without a cookie', async (t) => {
  const { baseUrl } = await withAuthenticationServer(t);
  const response = await fetch(`${baseUrl}/api/sessions/current`);

  assert.equal(response.status, 401);
});

test('rejects current with a manipulated token', async (t) => {
  const { baseUrl, password } = await withAuthenticationServer(t);
  const loginResponse = await postLogin(baseUrl, password);
  const cookie = getSessionCookie(loginResponse);
  const response = await fetch(`${baseUrl}/api/sessions/current`, {
    headers: { cookie: `${cookie}tampered` },
  });

  assert.equal(response.status, 401);
});

test('logout clears the cookie and current then rejects the request', async (t) => {
  const { baseUrl, password } = await withAuthenticationServer(t);
  const loginResponse = await postLogin(baseUrl, password);
  const cookie = getSessionCookie(loginResponse);
  const logoutResponse = await fetch(`${baseUrl}/api/sessions/logout`, {
    method: 'POST',
    headers: { cookie },
  });
  const clearedCookie = logoutResponse.headers.get('set-cookie');

  assert.equal(logoutResponse.status, 200);
  assert.ok(clearedCookie);
  assert.match(clearedCookie, /^currentUser=;/);

  const currentResponse = await fetch(`${baseUrl}/api/sessions/current`);
  assert.equal(currentResponse.status, 401);
});
