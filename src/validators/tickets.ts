import { body } from 'express-validator';
import {
  TicketTypeRequiredError,
  TicketTypeInvalidError,
  TitleRequiredError,
  TitleLengthError,
  DetailRequiredError,
  DetailTooLongError,
  IDInvalidError
} from '../utils/errors';
import {
  TICKET_TYPES,
  TITLE_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  DETAIL_MAX_LENGTH
} from '../constants/validation';

export const validateType = () =>
  body('type')
    .trim()
    .notEmpty()
    .withMessage((_, { req }) => (req.error = new TicketTypeRequiredError()))
    .bail({ level: 'request' })
    .customSanitizer((type) => `${type[0].toUpperCase()}${type.slice(1)}`)
    .isIn(TICKET_TYPES)
    .withMessage((_, { req }) => (req.error = new TicketTypeInvalidError()))
    .bail({ level: 'request' });

export const validateTitle = () =>
  body('title')
    .trim()
    .notEmpty()
    .withMessage((_, { req }) => (req.error = new TitleRequiredError()))
    .bail({ level: 'request' })
    .isLength({ min: TITLE_MIN_LENGTH, max: TITLE_MAX_LENGTH })
    .withMessage((_, { req }) => (req.error = new TitleLengthError()))
    .bail({ level: 'request' });

export const validateDetail = () =>
  body('detail')
    .trim()
    .notEmpty()
    .withMessage((_, { req }) => (req.error = new DetailRequiredError()))
    .bail({ level: 'request' })
    .isLength({ max: DETAIL_MAX_LENGTH })
    .withMessage((_, { req }) => (req.error = new DetailTooLongError()))
    .bail({ level: 'request' });

export const validateProject = () =>
  body('project')
    .trim()
    .isMongoId()
    .withMessage((_, { req }) => (req.error = new IDInvalidError()))
    .bail({ level: 'request' });
