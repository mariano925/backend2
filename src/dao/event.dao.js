import Event from '../models/Event.js';

// Encapsula el acceso a los eventos del modelo Event.
class EventDAO {
  async getAll() {
    return Event.find();
  }

  async create(eventData) {
    return Event.create(eventData);
  }
}

export default new EventDAO();
