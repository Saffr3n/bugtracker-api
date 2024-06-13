import { create } from '../services/users';
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
