import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import logger from 'morgan';
import SystemError, { clientErrors } from './utils/errors';
import User from './models/user';
import userRouter from './routes/user';

const app = express();

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
      .catch((err) => new SystemError(err));

    if (user instanceof SystemError) {
      return done(user);
    }

    if (!user) {
      return done(null, false);
    }

    const isCorrectPassword = await bcrypt
      .compare(password, user.hash)
      .catch((err) => new SystemError(err));

    if (isCorrectPassword instanceof SystemError) {
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
    .catch((err) => new SystemError(err));

  if (user instanceof SystemError) {
    return done(user);
  }

  done(null, user);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SECRET || 'secret',
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

app.use('/users', userRouter);

app.get('/errors/:name', (req, res, next) => {
  const errName = req.params.name
    .toLowerCase()
    .split('-')
    .map((word) => `${word[0]?.toUpperCase()}${word.slice(1)}`)
    .join('') as keyof typeof clientErrors;

  const errClass = clientErrors[errName];

  if (!errClass) {
    return next();
  }

  const err = new errClass();
  const { title, status, detail } = err;

  res
    .status(200)
    .send(`<h1>${title}</h1>\n<h2>${status}</h2>\n<p>${detail}</p>`);
});

app.use((req, res, next) => next(new clientErrors.PathNotFound()));
app.use((err: Err, req: Req, res: Res, next: Next) => {
  const env = process.env.NODE_ENV || 'development';

  if (env === 'production' && err.status >= 500) {
    console.error(err);
    err = new clientErrors.Internal();
  }

  res.status(err.status).json({
    type: err.type,
    status: err.status,
    title: err.title,
    detail: err.detail,
    stack: env === 'development' ? err.stack : undefined
  } as ErrorResponse);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App is available on port ${port}`));
