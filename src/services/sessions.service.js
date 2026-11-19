import UsersRepository from '../repositories/users.repository.js';
import { comparePassword, hashPassword } from '../utils/hash.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createRequestError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

// Valida y prepara el registro, usando el helper de hash y el repository para persistir al usuario.
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
      throw createRequestError('El email no es válido', 400);
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

  async login(credentials = {}) {
    const { email, password } = credentials;

    if (
      typeof email !== 'string' ||
      !email.trim() ||
      typeof password !== 'string' ||
      !password
    ) {
      throw createRequestError('Email y contraseña son obligatorios', 400);
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await UsersRepository.findByEmail(normalizedEmail);

    if (!user || !(await comparePassword(password, user.password))) {
      throw createRequestError('Credenciales inválidas', 401);
    }

    return user;
  }
}

export default new SessionsService();
