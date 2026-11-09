
import EventService from '../services/event.service.js';

// El Controller recibe la solicitud y delega la consulta al Service.
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
