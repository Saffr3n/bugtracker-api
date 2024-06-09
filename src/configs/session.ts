import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import { SECRET, DB_NAME } from '../constants/env';
import { name } from '../../package.json';

const store = MongoStore.create({
  client: mongoose.connection.getClient(),
  dbName: DB_NAME
});

const opts: session.SessionOptions = {
  secret: SECRET,
  name,
  store,
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
  resave: false,
  saveUninitialized: false,
  unset: 'destroy'
};

export default () => session(opts);
