
import express from 'express';
import healthRouter from './routes/health.router.js';
import eventsRouter from './routes/events.router.js';
import sessionsRouter from './routes/sessions.router.js';

const app = express();

// Configura Express para recibir JSON.
app.use(express.json());

// Registra las rutas de la API.
app.use('/api/health', healthRouter);
app.use('/api/events', eventsRouter);
app.use('/api/sessions', sessionsRouter);

export default app;
