import checkAuthentication from './check-authentication';
import { AccessDeniedError } from '../utils/errors';
import { USER_ROLES } from '../constants/validation';
import type { Request, Response, NextFunction } from 'express';

export default (requiredRole: UserRole) =>
  (req: Request, res: Response, next: NextFunction) => {
    checkAuthentication((err, user) => {
      if (err) return next(err);
      const isEligible = USER_ROLES[user!.role] >= USER_ROLES[requiredRole];
      if (!isEligible) return next(new AccessDeniedError());
      next();
    })(req, res, next);
  };
