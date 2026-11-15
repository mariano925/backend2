
import { Router } from 'express';
import {
  getSessions,
  registerUser,
} from '../controllers/sessions.controller.js';

const router = Router();

// Conecta los endpoints de sesiones con sus controladores; app.js monta este router en /api/sessions.
router.get('/', getSessions);
router.post('/register', registerUser);

export default router;
