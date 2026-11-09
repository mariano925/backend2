import EventRepository from '../repositories/event.repository.js';

// El service coordina la consulta delegándola al repository.
class EventService {
  async getAll() {
    return EventRepository.getAll();
  }

  async create(eventData) {
    return EventRepository.create(eventData);
  }
}

export default new EventService();
