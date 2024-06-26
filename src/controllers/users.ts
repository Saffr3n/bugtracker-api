import User from '../models/user';
import { create, getAll } from '../services/users';
import { validateLimit, validatePage, validateSort } from '../validators';
import {
  validateUsername,
  validateEmail,
  validatePassword
} from '../validators/users';
import authenticate from '../middlewares/authenticate';
import { ApiError } from '../utils/errors';
import type { Request, Response, NextFunction } from 'express';

export const createUser = [
  validateUsername(),
  validateEmail(),
  validatePassword(),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const err = req.error;
      if (err) return next(err);
      const user = await create(req.body);
      res.locals.user = user;
      next();
    } catch (err) {
      next(new ApiError(err));
    }
  },
  authenticate(true)
];

export const getUsers = [
  validateLimit(),
  validatePage(),
  validateSort(User),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const err = req.error;
      if (err) return next(err);

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
    } catch (err) {
      next(new ApiError(err));
    }
  }
];
