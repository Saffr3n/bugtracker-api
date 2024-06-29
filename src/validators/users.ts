import { param, body } from 'express-validator';
import { getByUsername, getByEmail } from '../services/users';
import { passValidationError, capitalizeString } from '../utils';
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
  PasswordConfirmationError,
  UserRoleInvalidError
} from '../utils/errors';
import {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  USER_ROLES
} from '../constants/validation';

export const validateUserId = () =>
  param('userId')
    .trim()
    .isMongoId()
    .withMessage(passValidationError(new UserIDInvalidError()))
    .bail({ level: 'request' });

export const validateUsername = (optional: boolean = false) => {
  const chain = body('username');
  if (optional) chain.optional();
  chain.trim();

  if (!optional) {
    chain
      .notEmpty()
      .withMessage(passValidationError(new UsernameRequiredError()))
      .bail({ level: 'request' });
  }

  chain
    .isLength({ min: USERNAME_MIN_LENGTH })
    .withMessage(passValidationError(new UsernameTooShortError()))
    .bail({ level: 'request' })
    .isLength({ max: USERNAME_MAX_LENGTH })
    .withMessage(passValidationError(new UsernameTooLongError()))
    .bail({ level: 'request' })
    .custom((username) => /[a-z]/i.test(username[0]))
    .withMessage(passValidationError(new UsernameStartError()))
    .bail({ level: 'request' })
    .matches(/^[a-z0-9._-]*$/i)
    .withMessage(passValidationError(new UsernameInvalidCharactersError()))
    .bail({ level: 'request' })
    .matches(/(?!.*[._-]{2,})^.*$/)
    .withMessage(passValidationError(new UsernameConsecutiveCharactersError()))
    .bail({ level: 'request' })
    .custom((username) => /[a-z0-9]/i.test(username[username.length - 1]))
    .withMessage(passValidationError(new UsernameEndError()))
    .bail({ level: 'request' })
    .custom(async (username, { req }) => {
      let user: UserDocument | null | undefined;
      let error: ApiError | undefined;

      try {
        user = await getByUsername(username);
        if (user) error = new UsernameAlreadyInUseError();
      } catch (err) {
        error = new ApiError(err);
      }

      req.error = error;
      return error ? Promise.reject() : Promise.resolve();
    })
    .bail({ level: 'request' });

  return chain;
};

export const validateEmail = (optional: boolean = false) => {
  const chain = body('email');
  if (optional) chain.optional();
  chain.trim().toLowerCase();

  if (!optional) {
    chain
      .notEmpty()
      .withMessage(passValidationError(new EmailRequiredError()))
      .bail({ level: 'request' });
  }

  chain
    .isEmail()
    .withMessage(passValidationError(new EmailInvalidError()))
    .bail({ level: 'request' })
    .custom(async (email, { req }) => {
      let user: UserDocument | null | undefined;
      let error: ApiError | undefined;

      try {
        user = await getByEmail(email);
        if (user) error = new EmailAlreadyInUseError();
      } catch (err) {
        error = new ApiError(err);
      }

      req.error = error;
      return error ? Promise.reject() : Promise.resolve();
    })
    .bail({ level: 'request' });

  return chain;
};

export const validatePassword = (optional: boolean = false) => {
  const chain = body(optional ? 'newPassword' : 'password');
  if (optional) chain.optional();
  chain.trim();

  if (!optional) {
    chain
      .notEmpty()
      .withMessage(passValidationError(new PasswordRequiredError()))
      .bail({ level: 'request' });
  }

  chain
    .isLength({ min: PASSWORD_MIN_LENGTH })
    .withMessage(passValidationError(new PasswordTooShortError()))
    .bail({ level: 'request' })
    .matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)^.*$/)
    .withMessage(passValidationError(new PasswordInvalidError()))
    .bail({ level: 'request' })
    .custom((password, { req }) => password === req.body.confirm)
    .withMessage(passValidationError(new PasswordConfirmationError()))
    .bail({ level: 'request' });

  return chain;
};

export const validateRole = () =>
  body('role')
    .optional()
    .trim()
    .toLowerCase()
    .customSanitizer(capitalizeString)
    .isIn(Object.keys(USER_ROLES).filter((key) => isNaN(+key)))
    .withMessage(passValidationError(new UserRoleInvalidError()))
    .bail({ level: 'request' });
