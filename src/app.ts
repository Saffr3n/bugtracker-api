import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import logger from 'morgan';
import path from 'path';
import User from './models/user';
import {
  InternalServerError,
  MongoError,
  BcryptError,
  PathNotFoundError
} from './utils/errors';

const app = express();

const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 3000;
const secret = process.env.SECRET || 'secret';
const dbUri = process.env.DB_URI || 'mongodb://127.0.0.1:27017';
const dbName = process.env.DB_NAME || 'bugtracker';

mongoose.set('strictQuery', false);
mongoose.connect(dbUri, { dbName }).catch(console.error);

passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = await User.findOne({
      $or: [{ username: username }, { email: username }]
    })
      .exec()
      .catch((err) => new MongoError(err));

    if (user instanceof MongoError) {
      return done(user);
    }

    if (!user) {
      return done(null, false);
    }

    const isCorrectPassword = await bcrypt
      .compare(password, user.hash)
      .catch((err) => new BcryptError(err));

    if (isCorrectPassword instanceof BcryptError) {
      return done(isCorrectPassword);
    }

    if (!isCorrectPassword) {
      return done(null, false);
    }

    done(null, user);
  })
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id)
    .exec()
    .catch((err) => new MongoError(err));

  if (user instanceof MongoError) {
    return done(user);
  }

  done(null, user);
});

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

app.use(passport.initialize());
app.use(passport.session());

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
