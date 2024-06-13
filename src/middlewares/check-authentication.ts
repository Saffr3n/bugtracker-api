import { UnauthenticatedError } from '../utils/errors';
import type { Request, Response, NextFunction } from 'express';

/**
 * @param callback - If provided, completely overrides default behavior, which means that the
 *                   callback is also responsible for calling `next()`.
 */
export default (
    callback?: (err?: UnauthenticatedError, user?: Express.User) => void
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    let err: UnauthenticatedError | undefined;
    if (!user) err = new UnauthenticatedError();
    if (callback) return callback(err, user);
    if (err) return next(err);
    next();
  };
