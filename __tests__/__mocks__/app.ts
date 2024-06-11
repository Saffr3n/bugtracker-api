import MongoStore from 'connect-mongo';
import type { Application } from 'express';

jest
  .spyOn(MongoStore, 'create')
  .mockReturnValue(undefined as unknown as MongoStore);

export default require('../../src/configs/app').default as Application;
