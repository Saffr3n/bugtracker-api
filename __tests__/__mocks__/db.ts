import bcrypt from 'bcryptjs';
import User from '../../src/models/user';
import Project from '../../src/models/project';

const AMOUNT_OF_MANAGERS = 2;
const AMOUNT_OF_DEVELOPERS = 10;
const AMOUNT_OF_USERS = 50;

const admin = new User({
  username: 'admin',
  email: 'admin@example.com',
  hash: bcrypt.hashSync('Test1234', 12),
  role: 'Admin'
});

const managers: UserDocument[] = [];
for (let i = 0; i < AMOUNT_OF_MANAGERS; i++) {
  managers.push(
    new User({
      username: `manager_${i + 1}`,
      email: `manager_${i + 1}.example.com`,
      hash: bcrypt.hashSync('Test1234', 12),
      role: 'Project Manager'
    })
  );
}

const developers: UserDocument[] = [];
for (let i = 0; i < AMOUNT_OF_DEVELOPERS; i++) {
  developers.push(
    new User({
      username: `developer_${i + 1}`,
      email: `developer_${i + 1}.example.com`,
      hash: bcrypt.hashSync('Test1234', 12),
      role: 'Developer'
    })
  );
}

const users: UserDocument[] = [];
for (let i = 0; i < AMOUNT_OF_USERS; i++) {
  users.push(
    new User({
      username: `user_${i + 1}`,
      email: `user_${i + 1}.example.com`,
      hash: bcrypt.hashSync('Test1234', 12)
    })
  );
}

export default {
  users: [admin, ...managers, ...developers, ...users],

  projects: [
    new Project({
      title: 'Test Project',
      description: 'Test description...',
      manager: admin.id
    })
  ],

  tickets: [] as TicketDocument[]
};
