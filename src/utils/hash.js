import bcrypt from 'bcrypt';

// Provee el helper de hash que el service usa antes de persistir contraseñas.
const SALT_ROUNDS = 10;

export function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}
