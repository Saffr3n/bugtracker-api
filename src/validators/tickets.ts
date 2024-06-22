import { body } from 'express-validator';
import { getById } from '../services/projects';
import { passValidationError, capitalizeString } from '../utils';
import {
  ApiError,
  TicketTypeRequiredError,
  TicketTypeInvalidError,
  TicketPriorityRequiredError,
  TicketPriorityInvalidError,
  TitleRequiredError,
  TitleLengthError,
  DetailRequiredError,
  DetailTooLongError,
  IDInvalidError,
  DocumentNotFoundError
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
    .customSanitizer((type) => capitalizeString(type))
    .isIn(TICKET_TYPES)
    .withMessage(passValidationError(new TicketTypeInvalidError()))
    .bail({ level: 'request' });

export const validatePriority = () =>
  body('priority')
    .trim()
    .notEmpty()
    .withMessage(passValidationError(new TicketPriorityRequiredError()))
    .bail({ level: 'request' })
    .customSanitizer((priority) => capitalizeString(priority))
    .isIn(TICKET_PRIORITIES)
    .withMessage(passValidationError(new TicketPriorityInvalidError()))
    .bail({ level: 'request' });

export const validateTitle = () =>
  body('title')
    .trim()
    .notEmpty()
    .withMessage(passValidationError(new TitleRequiredError()))
    .bail({ level: 'request' })
    .isLength({ min: TITLE_MIN_LENGTH, max: TITLE_MAX_LENGTH })
    .withMessage(passValidationError(new TitleLengthError()))
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
    .withMessage(passValidationError(new IDInvalidError()))
    .bail({ level: 'request' })
    .custom(async (id, { req }) => {
      let project: ProjectDocument | null;

      try {
        project = await getById(id);
      } catch (err) {
        throw (req.error = new ApiError(err));
      }

      if (!project) throw (req.error = new DocumentNotFoundError());
    })
    .bail({ level: 'request' });
