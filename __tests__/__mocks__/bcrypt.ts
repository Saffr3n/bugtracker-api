import bcrypt from 'bcryptjs';

export default () => {
  jest.spyOn(bcrypt, 'compare').mockImplementation((password, hash) => {
    return Promise.resolve(password === hash);
  });

  jest.spyOn(bcrypt, 'hash').mockImplementation((password) => {
    return Promise.resolve(password);
  });
};
