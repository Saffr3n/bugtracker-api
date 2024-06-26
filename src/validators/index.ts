import { query } from 'express-validator';
import { passValidationError } from '../utils';
import {
  LimitInvalidError,
  LimitTooLowError,
  LimitTooHighError,
  PageInvalidError,
  PageTooLowError,
  SortInvalidError
} from '../utils/errors';
import {
  LIMIT_MIN_VALUE,
  LIMIT_MAX_VALUE,
  PAGE_MIN_VALUE
} from '../constants/validation';
import type { Model } from 'mongoose';

export const validateLimit = () =>
  query('limit')
    .optional()
    .trim()
    .isInt()
    .withMessage(passValidationError(new LimitInvalidError()))
    .bail({ level: 'request' })
    .isInt({ min: LIMIT_MIN_VALUE })
    .withMessage(passValidationError(new LimitTooLowError()))
    .bail({ level: 'request' })
    .isInt({ max: LIMIT_MAX_VALUE })
    .withMessage(passValidationError(new LimitTooHighError()))
    .bail({ level: 'request' })
    .toInt();

export const validatePage = () =>
  query('page')
    .optional()
    .trim()
    .isInt()
    .withMessage(passValidationError(new PageInvalidError()))
    .bail({ level: 'request' })
    .isInt({ min: PAGE_MIN_VALUE })
    .withMessage(passValidationError(new PageTooLowError()))
    .bail({ level: 'request' })
    .toInt();

export const validateSort = <T, U extends { toJson(): Record<string, any> }, V>(
  model: Model<T, {}, {}, {}, U, V>
) =>
  query('sort')
    .optional()
    .trim()
    .custom((sort: string, { req }) => {
      const docKeys = Object.keys(new model().toJson());
      const sortKeys = sort.replaceAll('-', '').split(' ');
      const valid = sortKeys.every((key) => docKeys.includes(key));

      if (!valid) {
        req.error = new SortInvalidError();
      }

      return valid;
    })
    .bail({ level: 'request' })
    .customSanitizer((sort: string) => sort.replaceAll(/(id|url)/g, '_id'));
