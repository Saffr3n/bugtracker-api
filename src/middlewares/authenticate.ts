import { ApiError } from '../utils/errors';
import type { Request, Response, NextFunction } from 'express';

export default (isNewUser: boolean = false) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { user } = res.locals;

    if (!user) {
      return next(
        new ApiError(
          'Cannot login without user provided. Assign user document to res.locals.user before using this middleware.'
        )
      );
    }

    req.login(user, (err?: ApiError) => {
      if (err) return next(err);

      const json: SuccessResponseJson = {
        status: 200,
        title: isNewUser ? 'Registered' : 'Logged In',
        detail: `User ${user.username} with id ${user.id} was successfully ${
          isNewUser ? 'registered and ' : ''
        }logged in.`,
        data: user.toJson()
      };

      res.status(json.status).json(json);
    });
  };
