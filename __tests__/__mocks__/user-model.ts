import User from '../../src/models/user';
import mockDb from './db';

export default () => {
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
