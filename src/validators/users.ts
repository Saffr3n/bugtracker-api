import { body } from 'express-validator';
import { getUserByUsername, getUserByEmail } from '../services/users';
import {
  ApiError,
  UsernameRequiredError,
  UsernameLengthError,
  UsernameInvalidError,
  UsernameAlreadyInUseError,
  EmailRequiredError,
  EmailInvalidError,
  EmailAlreadyInUseError,
  PasswordRequiredError,
  PasswordTooShortError,
  PasswordInvalidError,
  PasswordConfirmationError
} from '../utils/errors';
import {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH
} from '../constants/validation';

export const validateUsername = () =>
  body('username')
    .trim()
    .notEmpty()
    .withMessage((_, { req }) => (req.error = new UsernameRequiredError()))
    .bail({ level: 'request' })
    .isLength({ min: USERNAME_MIN_LENGTH, max: USERNAME_MAX_LENGTH })
    .withMessage((_, { req }) => (req.error = new UsernameLengthError()))
    .bail({ level: 'request' })
    .matches(/(?!.*[._-]{2,})(?!.*[._-]$)^[a-z][\w.-]*$/i)
    .withMessage((_, { req }) => (req.error = new UsernameInvalidError()))
    .bail({ level: 'request' })
    .custom(async (username, { req }) => {
      let user: UserDocument | null;

      try {
        user = await getUserByUsername(username);
      } catch (err) {
        throw (req.error = new ApiError(err));
      }

      if (user) {
        throw (req.error = new UsernameAlreadyInUseError());
      }
    })
    .bail({ level: 'request' });

export const validateEmail = () =>
  body('email')
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage((_, { req }) => (req.error = new EmailRequiredError()))
    .bail({ level: 'request' })
    .isEmail()
    .withMessage((_, { req }) => (req.error = new EmailInvalidError()))
    .bail({ level: 'request' })
    .custom(async (email, { req }) => {
      let user: UserDocument | null;

      try {
        user = await getUserByEmail(email);
      } catch (err) {
        throw (req.error = new ApiError(err));
      }

      if (user) {
        throw (req.error = new EmailAlreadyInUseError());
      }
    })
    .bail({ level: 'request' });

export const validatePassword = () =>
  body('password')
    .trim()
    .notEmpty()
    .withMessage((_, { req }) => (req.error = new PasswordRequiredError()))
    .bail({ level: 'request' })
    .isLength({ min: PASSWORD_MIN_LENGTH })
    .withMessage((_, { req }) => (req.error = new PasswordTooShortError()))
    .bail({ level: 'request' })
    .matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)^.*$/)
    .withMessage((_, { req }) => (req.error = new PasswordInvalidError()))
    .bail({ level: 'request' })
    .custom((password, { req }) => {
      if (password !== req.body.confirm) {
        throw (req.error = new PasswordConfirmationError());
      }
    })
    .bail({ level: 'request' });
