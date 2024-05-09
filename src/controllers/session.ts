import passport from 'passport';
import { LoginError, UnauthenticatedError } from '../utils/errors';

export function login(req: Req, res: Res, next: Next) {
  passport.authenticate('local', (err: Err, user: Express.User) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return next(new LoginError());
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      res.status(200).json({
        status: res.statusCode,
        title: 'Logged In',
        detail: `User ${user.username} with id ${user.id} was successfully logged in.`,
        user: user.normalize()
      } as DataResponse);
    });
  })(req, res, next);
}

export function logout(req: Req, res: Res, next: Next) {
  if (!req.user) {
    return next(new UnauthenticatedError());
  }

  const { username, id } = req.user;

  req.logout((err) => {
    if (err) {
      return next(err);
    }

    res.status(200).json({
      status: res.statusCode,
      title: 'Logged Out',
      detail: `User ${username} with id ${id} was successfully logged out.`
    } as DataResponse);
  });
}
