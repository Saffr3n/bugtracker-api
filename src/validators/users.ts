import { body } from 'express-validator';
import { getByUsername, getByEmail } from '../services/users';
import { passValidationError } from '../utils';
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
  USERNAME_PATTERN,
  PASSWORD_MIN_LENGTH,
  PASSWORD_PATTERN
} from '../constants/validation';

export const validateUsername = () =>
  body('username')
    .trim()
    .notEmpty()
    .withMessage(passValidationError(new UsernameRequiredError()))
    .bail({ level: 'request' })
    .isLength({ min: USERNAME_MIN_LENGTH, max: USERNAME_MAX_LENGTH })
    .withMessage(passValidationError(new UsernameLengthError()))
    .bail({ level: 'request' })
    .matches(USERNAME_PATTERN)
    .withMessage(passValidationError(new UsernameInvalidError()))
    .bail({ level: 'request' })
    .custom(async (username, { req }) => {
      let user: UserDocument | null;

      try {
        user = await getByUsername(username);
      } catch (err) {
        throw (req.error = new ApiError(err));
      }

      if (user) throw (req.error = new UsernameAlreadyInUseError());
    })
    .bail({ level: 'request' });

export const validateEmail = () =>
  body('email')
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage(passValidationError(new EmailRequiredError()))
    .bail({ level: 'request' })
    .isEmail()
    .withMessage(passValidationError(new EmailInvalidError()))
    .bail({ level: 'request' })
    .custom(async (email, { req }) => {
      let user: UserDocument | null;

      try {
        user = await getByEmail(email);
      } catch (err) {
        throw (req.error = new ApiError(err));
      }

      if (user) throw (req.error = new EmailAlreadyInUseError());
    })
    .bail({ level: 'request' });

export const validatePassword = () =>
  body('password')
    .trim()
    .notEmpty()
    .withMessage(passValidationError(new PasswordRequiredError()))
    .bail({ level: 'request' })
    .isLength({ min: PASSWORD_MIN_LENGTH })
    .withMessage(passValidationError(new PasswordTooShortError()))
    .bail({ level: 'request' })
    .matches(PASSWORD_PATTERN)
    .withMessage(passValidationError(new PasswordInvalidError()))
    .bail({ level: 'request' })
    .custom((password, { req }) => {
      const isConfirmed = password === req.body.confirm;
      if (!isConfirmed) throw (req.error = new PasswordConfirmationError());
    })
    .bail({ level: 'request' });
