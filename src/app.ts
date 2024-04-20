import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import logger from 'morgan';
import path from 'path';
import { InternalServerError, PathNotFoundError } from './utils/errors';

const app = express();

const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 3000;
const secret = process.env.SECRET || 'secret';
const dbUri = process.env.DB_URI || 'mongodb://127.0.0.1:27017';
const dbName = process.env.DB_NAME || 'bugtracker';

mongoose.set('strictQuery', false);
mongoose.connect(dbUri, { dbName }).catch(console.error);

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false,
    saveUninitialized: false,
    unset: 'destroy',
    store: new MongoStore({
      client: mongoose.connection.getClient(),
      dbName
    })
  })
);

app.use((req, res, next) => next(new PathNotFoundError()));
app.use((err: Err, req: Req, res: Res, next: Next) => {
  if (env === 'production' && err.status >= 500) {
    err = new InternalServerError();
  }

  res.status(err.status).json({
    type: err.type,
    status: err.status,
    title: err.title,
    detail: err.detail,
    stack: env === 'development' ? err.stack : undefined
  } as ErrorResponse);
});

app.listen(port, () => console.log(`App is available on port ${port}`));
