import User from '../models/User.js';

// Encapsula las consultas y escrituras de usuarios mediante el modelo User.
class UsersDAO {
  async findByEmail(email) {
    return User.findOne({ email });
  }

  async create(userData) {
    return User.create(userData);
  }
}

export default new UsersDAO();
