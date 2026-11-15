import EventRepository from '../repositories/event.repository.js';

// Coordina las operaciones de eventos y delega las consultas y escrituras al repository.
class EventService {
  async getAll() {
    return EventRepository.getAll();
  }

  async create(eventData) {
    return EventRepository.create(eventData);
  }
}

export default new EventService();
