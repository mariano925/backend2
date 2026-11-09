import Event from '../models/Event.js';

// Encapsula el acceso a los eventos del modelo Event.
class EventDAO {
  async getAll() {
    return Event.find();
  }
}

export default new EventDAO();
