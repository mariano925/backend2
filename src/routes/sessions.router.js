
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

// Adapta la autenticación de Passport al formato de errores de la API.
function authenticate(strategy, fallbackStatus) {
  return (req, res, next) => {
    passport.authenticate(
      strategy,
      { session: false },
      (error, user, info) => {
        if (error) return next(error);

        if (!user) {
          const missingCredentials = info?.message === 'Missing credentials';
          const statusCode = missingCredentials
            ? 400
            : info?.statusCode ?? fallbackStatus;

          return res.status(statusCode).json({
            status: 'error',
            message: info?.message || 'No autenticado',
          });
        }

        req.user = user;
        return next();
      }
    )(req, res, next);
  };
}

// Conecta los endpoints de sesiones con sus controladores; app.js monta este router en /api/sessions.
router.get('/', getSessions);
router.get('/current', authenticate('current', 401), getCurrentUser);
router.post('/register', authenticate('register', 400), registerUser);
router.post('/login', authenticate('login', 401), loginUser);
router.post('/logout', logoutUser);

export default router;
