import { AccessDeniedError, UnauthenticatedError } from '../utils/errors';
import { USER_ROLES } from '../constants/validation';
import type { RequestHandler, Request } from 'express';

interface AuthorizationChain extends AuthorizationMethods, RequestHandler {}
interface AuthorizationMethods {
  isRole(requiredRole: UserRole): AuthorizationChain;
  isOwnAccount(): AuthorizationChain;
}

class Authorization {
  private readonly middlewares: RequestHandler[] = [];
  private readonly methods: AuthorizationMethods = {
    isRole: this.isRole.bind(this),
    isOwnAccount: this.isOwnAccount.bind(this)
  };

  public constructor() {
    this.createMiddleware(() => true);
  }

  public build(): AuthorizationChain {
    const combined: RequestHandler = (req, res, next) => {
      const executeMiddleware = (index: number) => {
        if (index >= this.middlewares.length) return next();
        const middleware = this.middlewares[index]!;
        middleware(req, res, (err) => {
          if (err) return next(err);
          executeMiddleware(index + 1);
        });
      };

      executeMiddleware(0);
    };

    return Object.assign(combined, this.methods);
  }

  private createMiddleware(
    callback: (user: Express.User, request: Request) => boolean
  ): AuthorizationChain {
    const middleware: RequestHandler = (req, res, next) => {
      const { user } = req;
      if (!user) return next(new UnauthenticatedError());
      const isEligible = callback(user, req);
      if (!isEligible) return next(new AccessDeniedError());
      next();
    };

    this.middlewares.push(middleware);
    return this.build();
  }

  private isAdmin(user: Express.User): boolean {
    return USER_ROLES[user.role] === USER_ROLES['Admin'];
  }

  private isRole(requiredRole: UserRole): AuthorizationChain {
    return this.createMiddleware(
      (user) => USER_ROLES[user.role] >= USER_ROLES[requiredRole]
    );
  }

  private isOwnAccount(): AuthorizationChain {
    return this.createMiddleware(
      (user, req) => user.id === req.params.userId || this.isAdmin(user)
    );
  }
}

export default () => new Authorization().build();
