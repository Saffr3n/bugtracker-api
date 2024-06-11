import User, { type UserDocument } from '../../src/models/user';
import mockDb from './db';
import type { Query } from 'mongoose';

export default () => {
  jest.spyOn(User, 'findById').mockImplementation((id) => {
    return {
      exec: () => Promise.resolve(mockDb.users.find((user) => user.id === id))
    } as Query<any, any>;
  });

  jest.spyOn(User, 'findOne').mockImplementation((filter) => {
    let { username, email, $or } = filter!;
    let findCb: (user: UserDocument) => boolean;

    findCb = (user) => {
      let regex: RegExp;
      if ($or) regex = $or[0]!.username;
      else regex = username || email;
      const didMatchUsername = regex.test(user.username);
      const didMatchEmail = regex.test(user.email);
      return didMatchUsername || didMatchEmail;
    };

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
