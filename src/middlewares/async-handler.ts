import { ApiError } from '../utils/errors';
import type { Request, Response, NextFunction } from 'express';

export default (asyncFunction: Function) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const err = req.error;
      if (err) return next(err);
      await asyncFunction(req, res, next);
    } catch (err) {
      if (err instanceof ApiError) return next(err);
      next(new ApiError(err));
    }
  };
