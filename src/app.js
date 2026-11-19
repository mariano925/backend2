
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { initializePassport } from './config/passport.config.js';
import healthRouter from './routes/health.router.js';
import eventsRouter from './routes/events.router.js';
import sessionsRouter from './routes/sessions.router.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

initializePassport();

// Configura los middlewares generales.
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Registra las rutas de la API.
app.use('/api/health', healthRouter);
app.use('/api/events', eventsRouter);
app.use('/api/sessions', sessionsRouter);

// Centraliza el manejo de errores.
app.use(errorHandler);

export default app;
