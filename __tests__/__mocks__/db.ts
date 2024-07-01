import User from '../../src/models/user';
import Project from '../../src/models/project';
import Ticket from '../../src/models/ticket';

let users: UserDocument[];
let projects: ProjectDocument[];
let tickets: TicketDocument[];

const mockDb = () => {
  createUsers();
  createProjects();
  createTickets();

  return { users, projects, tickets };
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

const createProjects = () => {
  const AMOUNT_OF_PROJECTS = 50;

  const arr: ProjectDocument[] = [];

  for (let i = 0; i < AMOUNT_OF_PROJECTS; i++) {
    arr.push(
      new Project({
        title: `Test Project ${i + 1}`,
        detail: `Some detail for Test Project ${i + 1}...`,
        manager: users[0].id
      })
    );
  }

  projects = arr;
};

const createTickets = () => {
  const AMOUNT_OF_TICKETS = 50;

  const arr: TicketDocument[] = [];

  for (let i = 0; i < AMOUNT_OF_TICKETS; i++) {
    arr.push(
      new Ticket({
        type: 'Issue',
        priority: 'Medium',
        title: `Test Ticket ${i + 1}`,
        detail: `Some detail for Test Ticket ${i + 1}...`,
        project: projects[0].id,
        submitter: users[0].id
      })
    );
  }

  tickets = arr;
};

export type MockDB = ReturnType<typeof mockDb>;
export default mockDb;
