import UsersDAO from '../dao/users.dao.js';

class UsersRepository {
  async findByEmail(email) {
    return UsersDAO.findByEmail(email);
  }

  async create(userData) {
    return UsersDAO.create(userData);
  }
}

export default new UsersRepository();
