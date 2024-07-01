import User from '../../src/models/user';
import Project from '../../src/models/project';

let users: UserDocument[];

const mockDb = () => {
  createUsers();

  return {
    users,
    projects: [
      new Project({
        title: 'Test Project',
        description: 'Test description...',
        manager: users[0].id
      })
    ],
    tickets: [] as TicketDocument[]
  };
};

const createUsers = () => {
  const AMOUNT_OF_MANAGERS = 2;
  const AMOUNT_OF_DEVELOPERS = 10;
  const AMOUNT_OF_USERS = 50;

  const arr: UserDocument[] = [];

  arr.push(
    new User({
      username: 'admin',
      email: 'admin@example.com',
      hash: 'Test1234',
      role: 'Admin'
    })
  );

  for (let i = 0; i < AMOUNT_OF_MANAGERS; i++) {
    arr.push(
      new User({
        username: `manager_${i + 1}`,
        email: `manager_${i + 1}.example.com`,
        hash: 'Test1234',
        role: 'Project Manager'
      })
    );
  }

  for (let i = 0; i < AMOUNT_OF_DEVELOPERS; i++) {
    arr.push(
      new User({
        username: `developer_${i + 1}`,
        email: `developer_${i + 1}.example.com`,
        hash: 'Test1234',
        role: 'Developer'
      })
    );
  }

  for (let i = 0; i < AMOUNT_OF_USERS; i++) {
    arr.push(
      new User({
        username: `user_${i + 1}`,
        email: `user_${i + 1}.example.com`,
        hash: 'Test1234'
      })
    );
  }

  users = arr;
};

export type MockDB = ReturnType<typeof mockDb>;
export default mockDb;
