import User from '../../src/models/user';

export default {
  users: [
    new User({ username: 'test', email: 'test@example.com', hash: 'Test1234' })
  ]
};
