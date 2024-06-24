import { body } from 'express-validator';
import { passValidationError } from '../utils';
import {
  TitleRequiredError,
  TitleTooShortError,
  TitleTooLongError,
  DetailTooLongError
} from '../utils/errors';
import {
  TITLE_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  DETAIL_MAX_LENGTH
} from '../constants/validation';

export const validateTitle = () =>
  body('title')
    .trim()
    .notEmpty()
    .withMessage(passValidationError(new TitleRequiredError()))
    .bail({ level: 'request' })
    .isLength({ min: TITLE_MIN_LENGTH })
    .withMessage(passValidationError(new TitleTooShortError()))
    .bail({ level: 'request' })
    .isLength({ max: TITLE_MAX_LENGTH })
    .withMessage(passValidationError(new TitleTooLongError()))
    .bail({ level: 'request' });

export const validateDetail = () =>
  body('detail')
    .optional()
    .trim()
    .isLength({ max: DETAIL_MAX_LENGTH })
    .withMessage(passValidationError(new DetailTooLongError()))
    .bail({ level: 'request' });
