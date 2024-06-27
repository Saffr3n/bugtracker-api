import { param, body } from 'express-validator';
import { getByUsername, getByEmail } from '../services/users';
import { passValidationError } from '../utils';
import {
  ApiError,
  UserIDInvalidError,
  UsernameRequiredError,
  UsernameTooShortError,
  UsernameTooLongError,
  UsernameStartError,
  UsernameInvalidCharactersError,
  UsernameConsecutiveCharactersError,
  UsernameEndError,
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

export const validateUserId = () =>
  param('userId')
    .trim()
    .isMongoId()
    .withMessage(passValidationError(new UserIDInvalidError()))
    .bail({ level: 'request' });

export const validateUsername = () =>
  body('username')
    .trim()
    .notEmpty()
    .withMessage(passValidationError(new UsernameRequiredError()))
    .bail({ level: 'request' })
    .isLength({ min: USERNAME_MIN_LENGTH })
    .withMessage(passValidationError(new UsernameTooShortError()))
    .bail({ level: 'request' })
    .isLength({ max: USERNAME_MAX_LENGTH })
    .withMessage(passValidationError(new UsernameTooLongError()))
    .bail({ level: 'request' })
    .custom((username, { req }) => {
      const regex = /[a-z]/i;
      const firstLetter = username[0];
      const startsWithLetter = regex.test(firstLetter);

      if (!startsWithLetter) {
        req.error = new UsernameStartError();
      }

      return startsWithLetter;
    })
    .bail({ level: 'request' })
    .matches(/^[a-z0-9._-]*$/i)
    .withMessage(passValidationError(new UsernameInvalidCharactersError()))
    .bail({ level: 'request' })
    .matches(/(?!.*[._-]{2,})^.*$/)
    .withMessage(passValidationError(new UsernameConsecutiveCharactersError()))
    .bail({ level: 'request' })
    .custom((username, { req }) => {
      const regex = /[a-z0-9]/i;
      const lastLetter = username[username.length - 1];
      const endsWithLetterOrNumber = regex.test(lastLetter);

      if (!endsWithLetterOrNumber) {
        req.error = new UsernameEndError();
      }

      return endsWithLetterOrNumber;
    })
    .bail({ level: 'request' })
    .custom(async (username, { req }) => {
      let user: UserDocument | null;

      try {
        user = await getByUsername(username);
      } catch (err) {
        req.error = new ApiError(err);
        return Promise.reject();
      }

      if (user) {
        req.error = new UsernameAlreadyInUseError();
        return Promise.reject();
      }

      return Promise.resolve();
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
        req.error = new ApiError(err);
        return Promise.reject();
      }

      if (user) {
        req.error = new EmailAlreadyInUseError();
        return Promise.reject();
      }

      return Promise.resolve();
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
    .matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)^.*$/)
    .withMessage(passValidationError(new PasswordInvalidError()))
    .bail({ level: 'request' })
    .custom((password, { req }) => {
      const { confirm } = req.body;
      const isConfirmed = password === confirm;

      if (!isConfirmed) {
        req.error = new PasswordConfirmationError();
      }

      return isConfirmed;
    })
    .bail({ level: 'request' });
