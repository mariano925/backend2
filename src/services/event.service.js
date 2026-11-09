import EventRepository from '../repositories/event.repository.js';

// El service coordina la consulta delegándola al repository.
class EventService {
  async getAll() {
    return EventRepository.getAll();
  }
}

export default new EventService();
