import User from '../models/user';
import {
  create,
  getAll,
  getById,
  getByIdAndEdit,
  getByIdAndDelete
} from '../services/users';
import asyncHandler from '../middlewares/async-handler';
import checkAuthorization from '../middlewares/authorization';
import authenticate from '../middlewares/authenticate';
import {
  validateUserId,
  validateUsername,
  validateEmail,
  validatePassword,
  validateRole
} from '../validators/users';
import { validateLimit, validatePage, validateSort } from '../validators';
import { noRoleEdit } from '../utils/authorization';
import { UserNotFoundError } from '../utils/errors';

export const createUser = [
  validateUsername(),
  validateEmail(),
  validatePassword(),

  asyncHandler(async (req, res, next) => {
    const user = await create(req.body);
    res.locals.user = user;
    next();
  }),

  authenticate(true)
];

export const getUsers = [
  validateLimit(),
  validatePage(),
  validateSort(User),

  asyncHandler(async (req, res) => {
    const users = await getAll(req.query);

    const json: SuccessResponseJson = {
      status: 200,
      title: 'Users Retrieved',
      detail: `Page ${
        req.query.page || 1
      } of users collection was successfully retrieved.`,
      data: users.map((user) => user.toJson())
    };

    res.status(json.status).json(json);
  })
];

export const getUser = [
  validateUserId(),

  asyncHandler(async (req, res, next) => {
    const user = await getById(req.params.userId);
    if (!user) return next(new UserNotFoundError());

    const json: SuccessResponseJson = {
      status: 200,
      title: 'User Retrieved',
      detail: `User ${user.username} with id ${user.id} was successfully retrieved.`,
      data: user.toJson(user.id === req.user?.id)
    };

    res.status(json.status).json(json);
  })
];

export const editUser = [
  checkAuthorization()
    .isAuthenticated()
    .isOwnAccount()
    .isCorrectPassword()
    .custom(noRoleEdit),

  validateUserId(),
  validateUsername(true),
  validateEmail(true),
  validatePassword(true),
  validateRole(),

  asyncHandler(async (req, res, next) => {
    const user = await getByIdAndEdit(req.params.userId, req.body);
    if (!user) return next(new UserNotFoundError());

    const json: SuccessResponseJson = {
      status: 200,
      title: 'User Updated',
      detail: `User ${user.username} with id ${user.id} was successfully updated.`,
      data: user.toJson(user.id === req.user?.id)
    };

    res.status(json.status).json(json);
  })
];

export const deleteUser = [
  checkAuthorization().isAuthenticated().isOwnAccount().isCorrectPassword(),

  validateUserId(),

  asyncHandler(async (req, res, next) => {
    const user = await getByIdAndDelete(req.params.userId);
    if (!user) return next(new UserNotFoundError());

    const json: SuccessResponseJson = {
      status: 200,
      title: 'User Deleted',
      detail: 'User was successfully deleted.'
    };

    res.status(json.status).json(json);
  })
];
