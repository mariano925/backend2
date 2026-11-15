import UsersDAO from '../dao/users.dao.js';

// Abstrae el acceso a usuarios y delega la persistencia al DAO para el service.
class UsersRepository {
  async findByEmail(email) {
    return UsersDAO.findByEmail(email);
  }

  async create(userData) {
    return UsersDAO.create(userData);
  }
}

export default new UsersRepository();
