import { ApiError } from '../utils/errors';
import type { RequestHandler, Request, Response, NextFunction } from 'express';

export default (requestHandler: RequestHandler) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const err = req.error;
      if (err) return next(err);
      await requestHandler(req, res, next);
    } catch (err) {
      if (err instanceof ApiError) return next(err);
      next(new ApiError(err));
    }
  };
