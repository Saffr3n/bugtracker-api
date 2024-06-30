import bcrypt from 'bcryptjs';
import {
  ApiError,
  AccessDeniedError,
  UnauthenticatedError
} from '../utils/errors';
import { USER_ROLES } from '../constants/validation';
import type { RequestHandler, Request } from 'express';

interface AuthorizationChain extends AuthorizationMethods, RequestHandler {}
interface AuthorizationMethods {
  custom(callback: AuthorizationCallback): AuthorizationChain;
  isAuthenticated(): AuthorizationChain;
  isRole(requiredRole: UserRole): AuthorizationChain;
  isOwnAccount(): AuthorizationChain;
  isCorrectPassword(): AuthorizationChain;
}

export type AuthorizationCallback = (
  user: Express.User,
  request: Request
) => boolean | Promise<boolean>;

class Authorization {
  private readonly middlewares: RequestHandler[] = [];
  private readonly methods: AuthorizationMethods = {
    custom: this.custom.bind(this),
    isAuthenticated: this.isAuthenticated.bind(this),
    isRole: this.isRole.bind(this),
    isOwnAccount: this.isOwnAccount.bind(this),
    isCorrectPassword: this.isCorrectPassword.bind(this)
  };

  public build(): AuthorizationChain {
    const combinedMiddleware: RequestHandler = (req, res, next) => {
      const executeMiddleware = (index: number) => {
        if (index >= this.middlewares.length) return next();
        const middleware = this.middlewares[index];
        middleware(req, res, (err) => {
          if (err) return next(err);
          executeMiddleware(index + 1);
        });
      };

      executeMiddleware(0);
    };

    return Object.assign(combinedMiddleware, this.methods);
  }

  private createMiddleware(
    callback: AuthorizationCallback
  ): AuthorizationChain {
    const middleware: RequestHandler = async (req, res, next) => {
      try {
        const { user } = req;
        if (!user) return next(new UnauthenticatedError());
        const isEligible = await callback(user, req);
        if (!isEligible) return next(new AccessDeniedError());
        next();
      } catch (err) {
        next(new ApiError(err));
      }
    };

    this.middlewares.push(middleware);
    return this.build();
  }

  private isAdmin(user: Express.User): boolean {
    return user.role === 'Admin';
  }

  private custom(callback: AuthorizationCallback): AuthorizationChain {
    return this.createMiddleware(callback);
  }

  private isAuthenticated(): AuthorizationChain {
    return this.createMiddleware(() => true);
  }

  private isRole(requiredRole: UserRole): AuthorizationChain {
    return this.createMiddleware((user) => {
      return USER_ROLES[user.role] >= USER_ROLES[requiredRole];
    });
  }

  private isOwnAccount(): AuthorizationChain {
    return this.createMiddleware((user, req) => {
      return user.id === req.params.userId || this.isAdmin(user);
    });
  }

  private isCorrectPassword(): AuthorizationChain {
    return this.createMiddleware((user, req) => {
      const { password } = req.body;
      return password && bcrypt.compare(password, user.hash);
    });
  }
}

export default () => new Authorization().build();
