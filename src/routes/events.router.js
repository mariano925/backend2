
import { Router } from 'express';
import { createEvent, getEvents } from '../controllers/events.controller.js';

const router = Router();

// Conecta los endpoints de eventos con sus controladores; app.js monta este router en /api/events.
router.get('/', getEvents);
router.post('/', createEvent);

export default router;
