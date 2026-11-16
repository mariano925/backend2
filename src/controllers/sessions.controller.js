
import SessionsService from '../services/sessions.service.js';
import { config } from '../config/config.js';

// Atiende las solicitudes de sesiones y delega el registro al service.
export function getSessions(req, res) {
  // Indica que el recurso todavía no está implementado.
  res.status(501).json({
    status: 'error',
    message: 'Recurso de sesiones pendiente de implementación',
  });
}

export function getCurrentUser(req, res) {
  return res.status(200).json({
    status: 'success',
    payload: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
    },
  });
}

export async function registerUser(req, res, next) {
  try {
    const user = await SessionsService.register(req.body);

    return res.status(201).json({
      status: 'success',
      payload: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function loginUser(req, res, next) {
  try {
    const { token } = await SessionsService.login(req.body);

    res.cookie('currentUser', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 3600000,
      secure: config.nodeEnv === 'production',
    });

    return res.status(200).json({
      status: 'success',
      message: 'Login correcto',
    });
  } catch (error) {
    next(error);
  }
}

export function logoutUser(req, res) {
  res.clearCookie('currentUser', {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.nodeEnv === 'production',
  });

  return res.status(200).json({
    status: 'success',
    message: 'Sesión cerrada',
  });
}
