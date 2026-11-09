import EventDAO from '../dao/event.dao.js';

// El repository abstrae el acceso a datos y delega al DAO.
class EventRepository {
  async getAll() {
    return EventDAO.getAll();
  }
}

export default new EventRepository();
