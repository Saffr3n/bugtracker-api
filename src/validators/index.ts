import { query } from 'express-validator';
import {
  passValidationError,
  isValidSort,
  normalizeSort
} from '../utils/validation';
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

export const validateSort = (model: Model<any>) =>
  query('sort')
    .optional()
    .trim()
    .custom(isValidSort(model))
    .withMessage(passValidationError(new SortInvalidError()))
    .bail({ level: 'request' })
    .customSanitizer(normalizeSort);
