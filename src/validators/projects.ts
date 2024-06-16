import { body } from 'express-validator';
import { getByTitle } from '../services/projects';
import {
  ApiError,
  TitleRequiredError,
  TitleLengthError,
  TitleInvalidError,
  TitleAlreadyInUseError,
  DetailTooLongError
} from '../utils/errors';
import {
  TITLE_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  TITLE_PATTERN,
  DETAIL_MAX_LENGTH
} from '../constants/validation';

export const validateTitle = () =>
  body('title')
    .trim()
    .notEmpty()
    .withMessage((_, { req }) => (req.error = new TitleRequiredError()))
    .bail({ level: 'request' })
    .isLength({ min: TITLE_MIN_LENGTH, max: TITLE_MAX_LENGTH })
    .withMessage((_, { req }) => (req.error = new TitleLengthError()))
    .bail({ level: 'request' })
    .matches(TITLE_PATTERN)
    .withMessage((_, { req }) => (req.error = new TitleInvalidError()))
    .bail({ level: 'request' })
    .custom(async (title, { req }) => {
      let project: ProjectDocument | null;

      try {
        project = await getByTitle(title);
      } catch (err) {
        throw (req.error = new ApiError(err));
      }

      if (project) throw (req.error = new TitleAlreadyInUseError());
    })
    .bail({ level: 'request' });

export const validateDetail = () =>
  body('detail')
    .optional()
    .trim()
    .isLength({ max: DETAIL_MAX_LENGTH })
    .withMessage((_, { req }) => (req.error = new DetailTooLongError()))
    .bail({ level: 'request' });
