import User from '../../src/models/user';
import mockDb from './db';
import { LIMIT_DEFAULT_VALUE } from '../../src/constants/validation';

export default () => {
  jest.spyOn(User, 'find').mockImplementation(() => {
    const users: UserDocument[] = [];

    for (let i = 0; i < LIMIT_DEFAULT_VALUE; i++) {
      users.push(mockDb.users[i]!);
    }

    return {
      exec: () => Promise.resolve(users)
    } as any;
  });

  jest.spyOn(User, 'findById').mockImplementation((id) => {
    return {
      exec: () => Promise.resolve(mockDb.users.find((user) => user.id === id))
    } as any;
  });

  jest.spyOn(User, 'findOne').mockImplementation((filter) => {
    const { username, email, $or } = filter!;
    const findCb = (user: UserDocument) => {
      let regex: RegExp;
      if ($or) regex = $or[0]!.username;
      else regex = username || email;
      const didMatchUsername = regex.test(user.username);
      const didMatchEmail = regex.test(user.email);
      return didMatchUsername || didMatchEmail;
    };

    return {
      exec: () => Promise.resolve(mockDb.users.find(findCb))
    } as any;
  });

  jest.spyOn(User, 'create').mockImplementation((data) => {
    const user = new User(data);
    mockDb.users.push(user);
    return Promise.resolve(user) as any;
  });
};
