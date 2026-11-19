
import { config } from '../config/config.js';
import { generateToken } from '../utils/jwt.js';

// Atiende las solicitudes de sesión después de la autenticación de Passport.
export function getSessions(req, res) {
  // Indica que el recurso todavía no está implementado.
  res.status(501).json({
    status: 'error',
    message: 'Recurso de sesiones pendiente de implementación',
  });
}

// Responde con los datos públicos del usuario autenticado por Passport.
export function getCurrentUser(req, res) {
  return res.status(200).json({
    status: 'success',
    payload: {
      id: String(req.user._id),
      email: req.user.email,
      role: req.user.role,
    },
  });
}

// Devuelve los datos públicos del usuario creado por Passport.
export function registerUser(req, res) {
  const user = req.user;

  return res.status(201).json({
    status: 'success',
    payload: {
      id: String(user._id),
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    },
  });
}

// Emite el JWT del usuario autenticado y lo establece en una cookie.
export function loginUser(req, res) {
  const user = req.user;
  const token = generateToken({
    id: String(user._id),
    email: user.email,
    role: user.role,
  });

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
}

// Elimina la cookie de autenticación manteniendo sus opciones de seguridad.
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
