import { body } from 'express-validator';
import bcrypt from 'bcryptjs';
import {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH
} from '../utils/constants';
import SystemError, { validationErrors } from '../utils/errors';
import User from '../models/user';

export const createUser = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage((_, { req }) => {
      req.err = new validationErrors.UsernameRequired();
    })
    .bail({ level: 'request' })
    .isLength({ min: USERNAME_MIN_LENGTH, max: USERNAME_MAX_LENGTH })
    .withMessage((_, { req }) => {
      req.err = new validationErrors.UsernameLength();
    })
    .bail({ level: 'request' })
    .matches(/(?!.*[._-]{2,})(?!.*[._-]$)^[a-z][\w.-]*$/i)
    .withMessage((_, { req }) => {
      req.err = new validationErrors.UsernameInvalid();
    })
    .bail({ level: 'request' })
    .custom(async (username, { req }) => {
      const user = await User.findOne({ username: new RegExp(username, 'i') })
        .exec()
        .catch((err) => new SystemError(err));

      if (user instanceof SystemError) {
        req.err = user;
      } else if (user) {
        req.err = new validationErrors.UsernameInUse();
      }
    })
    .bail({ level: 'request' }),
  body('email')
    .trim()
    .notEmpty()
    .withMessage((_, { req }) => {
      req.err = new validationErrors.EmailRequired();
    })
    .bail({ level: 'request' })
    .isEmail()
    .withMessage((_, { req }) => {
      req.err = new validationErrors.EmailInvalid();
    })
    .bail({ level: 'request' })
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email: new RegExp(email, 'i') })
        .exec()
        .catch((err) => new SystemError(err));

      if (user instanceof SystemError) {
        req.err = user;
      } else if (user) {
        req.err = new validationErrors.EmailInUse();
      }
    })
    .bail({ level: 'request' }),
  body('password')
    .trim()
    .notEmpty()
    .withMessage((_, { req }) => {
      req.err = new validationErrors.PasswordRequired();
    })
    .bail({ level: 'request' })
    .isLength({ min: PASSWORD_MIN_LENGTH })
    .withMessage((_, { req }) => {
      req.err = new validationErrors.PasswordTooShort();
    })
    .bail({ level: 'request' })
    .matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)^.*$/)
    .withMessage((_, { req }) => {
      req.err = new validationErrors.PasswordInvalid();
    })
    .bail({ level: 'request' })
    .custom((password, { req }) => {
      if (password !== req.body.confirm) {
        req.err = new validationErrors.PasswordConfirmation();
      }
    }),

  async (req: Req, res: Res, next: Next) => {
    const { err } = req;
    if (err) {
      return next(err);
    }

    const { username, email, password } = req.body;
    const hash = await bcrypt
      .hash(password, 12)
      .catch((err) => new SystemError(err));

    if (hash instanceof SystemError) {
      return next(hash);
    }

    const user = await new User({ username, email, hash })
      .save()
      .catch((err) => new SystemError(err));

    if (user instanceof SystemError) {
      return next(user);
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      res.status(200).json({
        status: res.statusCode,
        title: 'User Created',
        detail: `User ${username} with id ${user.id} was successfully registered and logged in.`,
        user: user.normalize()
      } as DataResponse);
    });
  }
];
