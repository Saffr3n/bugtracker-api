import morgan from 'morgan';
import MongoStore from 'connect-mongo';
import bcrypt from 'bcryptjs';
import type { Application } from 'express';

jest.mock('morgan');
const mockedMorgan = jest.mocked(morgan);
mockedMorgan.mockReturnValue((req, res, next) => next());

jest.spyOn(MongoStore, 'create').mockReturnValue(undefined as any);

jest
  .spyOn(bcrypt, 'hash')
  .mockImplementation((password) => Promise.resolve(password));
jest
  .spyOn(bcrypt, 'compare')
  .mockImplementation((password, hash) => Promise.resolve(password === hash));

export default require('../../src/configs/app').default as Application;
