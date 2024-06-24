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
  TitleTooShortError,
  TitleTooLongError,
  DetailRequiredError,
  DetailTooLongError,
  ProjectIDInvalidError,
  ProjectNotFoundError
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
    .bail({ level: 'request' })
    .custom(async (id, { req }) => {
      let project: ProjectDocument | null;

      try {
        project = await getById(id);
      } catch (err) {
        req.error = new ApiError(err);
        return Promise.reject();
      }

      if (!project) {
        req.error = new ProjectNotFoundError();
        return Promise.reject();
      }

      return Promise.resolve();
    })
    .bail({ level: 'request' });
