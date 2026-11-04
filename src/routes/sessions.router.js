
import { Router } from 'express';
import { getSessions } from '../controllers/sessions.controller.js';

const router = Router();

// Prepara la ruta inicial de sesiones.
router.get('/', getSessions);

export default router;
