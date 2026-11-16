
import { Router } from 'express';
import {
  getCurrentUser,
  getSessions,
  loginUser,
  logoutUser,
  registerUser,
} from '../controllers/sessions.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

// Conecta los endpoints de sesiones con sus controladores; app.js monta este router en /api/sessions.
router.get('/', getSessions);
router.get('/current', authMiddleware, getCurrentUser);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

export default router;
