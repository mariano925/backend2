
import { Router } from 'express';
import { createEvent, getEvents } from '../controllers/events.controller.js';

const router = Router();

// Deriva GET / al controlador de eventos.
router.get('/', getEvents);
router.post('/', createEvent);

export default router;
