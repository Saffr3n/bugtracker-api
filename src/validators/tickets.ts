import { body } from 'express-validator';
import { passValidationError, capitalizeString } from '../utils/validation';
import {
  TicketTypeRequiredError,
  TicketTypeInvalidError,
  TicketPriorityRequiredError,
  TicketPriorityInvalidError,
  TitleRequiredError,
  TitleTooShortError,
  TitleTooLongError,
  DetailRequiredError,
  DetailTooLongError,
  ProjectIDInvalidError
} from '../utils/errors';
import {
  TICKET_TYPES,
  TICKET_PRIORITIES,
  TITLE_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  DETAIL_MAX_LENGTH
} from '../constants/validation';

export const validateType = () =>
  body('type')
    .trim()
    .notEmpty()
    .withMessage(passValidationError(new TicketTypeRequiredError()))
    .bail({ level: 'request' })
    .toLowerCase()
    .customSanitizer(capitalizeString)
    .isIn(TICKET_TYPES)
    .withMessage(passValidationError(new TicketTypeInvalidError()))
    .bail({ level: 'request' });

export const validatePriority = () =>
  body('priority')
    .trim()
    .notEmpty()
    .withMessage(passValidationError(new TicketPriorityRequiredError()))
    .bail({ level: 'request' })
    .toLowerCase()
    .customSanitizer(capitalizeString)
    .isIn(TICKET_PRIORITIES)
    .withMessage(passValidationError(new TicketPriorityInvalidError()))
    .bail({ level: 'request' });

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
    .trim()
    .notEmpty()
    .withMessage(passValidationError(new DetailRequiredError()))
    .bail({ level: 'request' })
    .isLength({ max: DETAIL_MAX_LENGTH })
    .withMessage(passValidationError(new DetailTooLongError()))
    .bail({ level: 'request' });

export const validateProject = () =>
  body('project')
    .trim()
    .isMongoId()
    .withMessage(passValidationError(new ProjectIDInvalidError()))
    .bail({ level: 'request' });
