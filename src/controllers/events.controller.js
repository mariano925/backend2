
import EventService from '../services/event.service.js';

// Recibe solicitudes de eventos, delega al service, forma las respuestas y deriva errores.
export async function getEvents(req, res, next) {
  try {
    const events = await EventService.getAll();
    return res.status(200).json({
      status: 'success',
      payload: events,
    });
  } catch (error) {
    next(error);
  }
}

export async function createEvent(req, res, next) {
  try {
    const event = await EventService.create(req.body);

    return res.status(201).json({
      status: 'success',
      payload: event,
    });
  } catch (error) {
    next(error);
  }
}
