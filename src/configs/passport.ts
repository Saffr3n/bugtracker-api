import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { getByUsernameOrEmail, getById } from '../services/users';
import { ApiError } from '../utils/errors';

passport.use(
  new LocalStrategy(async (usernameOrEmail, password, done) => {
    try {
      const user = await getByUsernameOrEmail(usernameOrEmail);
      if (!user) return done(null);

      const isCorrectPassword = await bcrypt.compare(password, user.hash);
      if (!isCorrectPassword) return done(null);

      done(null, user);
    } catch (err) {
      done(new ApiError(err));
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await getById(id);
    done(null, user);
  } catch (err) {
    done(new ApiError(err));
  }
});

export default passport;
