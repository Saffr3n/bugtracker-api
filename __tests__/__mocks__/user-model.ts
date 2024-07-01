import User from '../../src/models/user';
import { LIMIT_DEFAULT_VALUE } from '../../src/constants/validation';
import type { MockDB } from './db';

export default (db: MockDB) => {
  jest.spyOn(User, 'find').mockImplementation(() => {
    const users: UserDocument[] = [];

    for (let i = 0; i < LIMIT_DEFAULT_VALUE; i++) {
      users.push(db.users[i]);
    }

    return { exec: () => Promise.resolve(users) } as any;
  });

  jest.spyOn(User, 'findById').mockImplementation((id) => {
    const user = db.users.find((user) => user.id === id);
    return { exec: () => Promise.resolve(user) } as any;
  });

  jest.spyOn(User, 'findOne').mockImplementation((filter) => {
    const { username, email, $or } = filter!;
    const user = db.users.find((user) => {
      let regex: RegExp;
      if ($or) regex = $or[0].username;
      else regex = username || email;
      const didMatchUsername = regex.test(user.username);
      const didMatchEmail = regex.test(user.email);
      return didMatchUsername || didMatchEmail;
    });

    return { exec: () => Promise.resolve(user) } as any;
  });

  jest.spyOn(User, 'create').mockImplementation((data) => {
    const user = new User(data);
    db.users.push(user);
    return Promise.resolve(user) as any;
  });

  jest.spyOn(User, 'findByIdAndUpdate').mockImplementation((id, update) => {
    const user = db.users.find((user) => user.id === id);

    if (user) {
      const keys = Object.keys(update) as (keyof UserRaw)[];

      keys.forEach((key) => {
        const field = update[key];
        if (!field) return;
        user[key] = field;
      });
    }

    return { exec: () => Promise.resolve(user) } as any;
  });

  jest.spyOn(User, 'findByIdAndDelete').mockImplementation((id) => {
    const index = db.users.findIndex((user) => user.id === id);
    const user = db.users[index];
    if (user) db.users.splice(index, 1);
    return { exec: () => Promise.resolve(user) } as any;
  });
};
