import UsersRepository from '../repositories/users.repository.js';
import { hashPassword } from '../utils/hash.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createRequestError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

class SessionsService {
  async register(userData = {}) {
    const { first_name, last_name, email, password } = userData;

    if (
      typeof first_name !== 'string' ||
      !first_name.trim() ||
      typeof last_name !== 'string' ||
      !last_name.trim() ||
      typeof email !== 'string' ||
      !email.trim() ||
      typeof password !== 'string' ||
      !password
    ) {
      throw createRequestError('Faltan campos obligatorios', 400);
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      throw createRequestError('Faltan campos obligatorios', 400);
    }

    if (password.length < 8) {
      throw createRequestError(
        'La contraseña debe tener al menos 8 caracteres',
        400
      );
    }

    const existingUser = await UsersRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      throw createRequestError('El email ya está registrado', 409);
    }

    const hashedPassword = await hashPassword(password);
    return UsersRepository.create({
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });
  }
}

export default new SessionsService();
