
import SessionsService from '../services/sessions.service.js';

 // Controla las operaciones de sesiones.
export function getSessions(req, res) {
  // Indica que el recurso todavía no está implementado.
  res.status(501).json({
    status: 'error',
    message: 'Recurso de sesiones pendiente de implementación',
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
