import { getByUsername, getByEmail } from '../services/users';
import {
  ApiError,
  UsernameAlreadyInUseError,
  EmailAlreadyInUseError
} from './errors';
import type {
  FieldMessageFactory,
  CustomSanitizer,
  CustomValidator
} from 'express-validator';
import type { Model } from 'mongoose';

export const passValidationError = (error: ApiError): FieldMessageFactory => {
  return (_, { req }) => (req.error = error);
};

export const capitalizeString: CustomSanitizer = (string: string) => {
  if (!string) return string;
  return `${string[0].toUpperCase()}${string.slice(1)}`;
};

export const normalizeSort: CustomSanitizer = (sort: string) => {
  return sort.replaceAll(/(id|url)/g, '_id');
};

export const isValidSort =
  <T extends { toJson(): Record<string, any> }>(
    model: Model<any, {}, {}, {}, T>
  ): CustomValidator =>
  (sort: string) => {
    const docKeys = Object.keys(new model().toJson());
    const sortKeys = sort.replaceAll('-', '').split(' ');
    return sortKeys.every((key) => docKeys.includes(key));
  };

export const startsWithLetter: CustomValidator = (string: string) => {
  return /[a-z]/i.test(string[0]);
};

export const endsWithLetterOrNumber: CustomValidator = (string: string) => {
  return /[a-z0-9]/i.test(string[string.length - 1]);
};

export const isUsernameNotInUse: CustomValidator = async (
  username: string,
  { req }
) => {
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
};

export const isEmailNotInUse: CustomValidator = async (
  email: string,
  { req }
) => {
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
};

export const isPasswordConfirmed: CustomValidator = (
  password: string,
  { req }
) => {
  return password === req.body.confirm;
};
