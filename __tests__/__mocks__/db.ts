import bcrypt from 'bcryptjs';
import User from '../../src/models/user';

export default {
  users: [
    new User({
      username: 'test',
      email: 'test@example.com',
      hash: bcrypt.hashSync('Test1234', 12)
    })
  ]
};
