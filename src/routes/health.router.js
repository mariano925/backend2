
import { Router } from 'express';
import { getHealth } from '../controllers/health.controller.js';

const router = Router();

// Deriva GET / al controlador de salud.
router.get('/', getHealth);

export default router;
