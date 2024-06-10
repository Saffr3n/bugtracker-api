import User, { type UserDocument } from '../../src/models/user';
import mockDb from './db';
import mockBcrypt from './bcrypt';
import mockStringToCaseInsensitiveRegex from './string-to-case-insensitive-regex';
import type { Query } from 'mongoose';

export default () => {
  mockBcrypt();
  mockStringToCaseInsensitiveRegex();

  jest.spyOn(User, 'findById').mockImplementation((id) => {
    return {
      exec: () => Promise.resolve(mockDb.users.find((user) => user.id === id))
    } as Query<any, any>;
  });

  jest.spyOn(User, 'findOne').mockImplementation((filter) => {
    let { username, email, $or } = filter!;
    let findCb: (user: UserDocument) => boolean;

    if ($or) username = $or[0]!.username;

    findCb = (user) =>
      user[username ? 'username' : 'email'] === (username || email);

    return {
      exec: () => Promise.resolve(mockDb.users.find(findCb))
    } as Query<any, any>;
  });

  jest.spyOn(User, 'create').mockImplementation((data) => {
    const user = new User(data);
    mockDb.users.push(user);
    return Promise.resolve(user) as unknown as Promise<UserDocument[]>;
  });
};
