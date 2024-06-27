import User from '../models/user';
import { create, getAll, getById } from '../services/users';
import { validateLimit, validatePage, validateSort } from '../validators';
import {
  validateUserId,
  validateUsername,
  validateEmail,
  validatePassword
} from '../validators/users';
import asyncHandler from '../middlewares/async-handler';
import authenticate from '../middlewares/authenticate';
import { UserNotFoundError } from '../utils/errors';
import type { Request, Response, NextFunction } from 'express';

export const createUser = [
  validateUsername(),
  validateEmail(),
  validatePassword(),

  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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

  asyncHandler(async (req: Request, res: Response) => {
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

  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await getById(req.params.userId!);
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
