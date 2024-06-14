import bcrypt from 'bcryptjs';
import User from '../../src/models/user';
import Project from '../../src/models/project';

const admin = new User({
  username: 'admin',
  email: 'admin@example.com',
  hash: bcrypt.hashSync('Test1234', 12),
  role: 'Admin'
});

export default {
  users: [
    admin,
    new User({
      username: 'manager',
      email: 'manager@example.com',
      hash: bcrypt.hashSync('Test1234', 12),
      role: 'Project Manager'
    }),
    new User({
      username: 'dev_1',
      email: 'dev_1@example.com',
      hash: bcrypt.hashSync('Test1234', 12),
      role: 'Developer'
    }),
    new User({
      username: 'dev_2',
      email: 'dev_2@example.com',
      hash: bcrypt.hashSync('Test1234', 12),
      role: 'Developer'
    }),
    new User({
      username: 'user_1',
      email: 'user_1@example.com',
      hash: bcrypt.hashSync('Test1234', 12),
      role: 'User'
    }),
    new User({
      username: 'user_2',
      email: 'user_2@example.com',
      hash: bcrypt.hashSync('Test1234', 12),
      role: 'User'
    })
  ],

  projects: [
    new Project({
      title: 'Test Project',
      description: 'Test description...',
      manager: admin.id
    })
  ]
};
