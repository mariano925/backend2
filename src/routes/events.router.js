
import { Router } from 'express';
import { getEvents } from '../controllers/events.controller.js';

const router = Router();

// Deriva GET / al controlador de eventos.
router.get('/', getEvents);

export default router;
