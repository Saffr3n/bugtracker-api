import morgan from 'morgan';
import MongoStore from 'connect-mongo';
import type { Application } from 'express';

jest.mock('morgan');
const mockedMorgan = jest.mocked(morgan);
mockedMorgan.mockReturnValue((req, res, next) => next());

jest.spyOn(MongoStore, 'create').mockReturnValue(undefined as any);

export default require('../../src/configs/app').default as Application;
