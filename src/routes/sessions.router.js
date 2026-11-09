
import { Router } from 'express';
import {
  getSessions,
  registerUser,
} from '../controllers/sessions.controller.js';

const router = Router();

// Prepara la ruta inicial de sesiones.
router.get('/', getSessions);
router.post('/register', registerUser);

export default router;
