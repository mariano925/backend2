import { Router } from 'express';
import {
  getCurrentUser,
  getSessions,
  loginUser,
  logoutUser,
  registerUser,
} from '../controllers/sessions.controller.js';
import passport from 'passport';

const router = Router();

// Adapta los resultados de Passport al formato de errores de la API.
function authenticate(strategy, fallbackStatus) {
  return (req, res, next) => {
    passport.authenticate(
      strategy,
      { session: false },
      (error, user, info) => {
        if (error) return next(error);

        if (!user) {
          const missingCredentials = info?.message === 'Missing credentials';

          let statusCode = info?.statusCode ?? fallbackStatus;
          let message = info?.message || 'No autenticado';

          if (strategy === 'current') {
            statusCode = 401;
            message = 'No autenticado';
          } else if (missingCredentials && strategy === 'register') {
            statusCode = 400;
            message = 'Faltan campos obligatorios';
          } else if (missingCredentials && strategy === 'login') {
            statusCode = 400;
            message = 'Email y contraseña son obligatorios';
          }

          return res.status(statusCode).json({
            status: 'error',
            message,
          });
        }

        req.user = user;
        return next();
      }
    )(req, res, next);
  };
}

// Conecta los endpoints de sesiones con sus controladores.
router.get('/', getSessions);
router.get('/current', authenticate('current', 401), getCurrentUser);
router.post('/register', authenticate('register', 400), registerUser);
router.post('/login', authenticate('login', 401), loginUser);
router.post('/logout', logoutUser);

export default router;
