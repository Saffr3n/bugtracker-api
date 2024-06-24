import passport from 'passport';
import authenticate from '../middlewares/authenticate';
import { AuthenticationError, type ApiError } from '../utils/errors';
import type { Request, Response, NextFunction } from 'express';

export const login = [
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (err?: ApiError, user?: UserDocument) => {
      if (err) return next(err);
      if (!user) return next(new AuthenticationError());
      res.locals.user = user;
      next();
    })(req, res, next);
  },
  authenticate()
];

export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout((err?: ApiError) => {
    if (err) return next(err);

    const json: SuccessResponseJson = {
      status: 200,
      title: 'Logged Out',
      detail: `User was successfully logged out.`
    };

    res.status(json.status).json(json);
  });
};
