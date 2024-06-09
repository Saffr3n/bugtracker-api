import { ApiError } from '../utils/errors';

export const NODE_ENV = (() => {
  const { NODE_ENV } = process.env;
  const val = NODE_ENV || 'development';
  if (val !== 'production' && val !== 'development' && val !== 'test') {
    throw new ApiError(
      'NODE_ENV environment variable must be one of the following: "production", "development", "test".'
    );
  }
  return val;
})();

export const PORT = (() => {
  const { PORT } = process.env;
  const val = PORT ? +PORT : 3000;
  if (val < 0 || val > 65535 || isNaN(val)) {
    throw new ApiError(
      'PORT environment variable must be an integer between 0 and 65535.'
    );
  }
  return val;
})();

export const SECRET = (() => {
  const { SECRET } = process.env;
  const val = SECRET || (NODE_ENV !== 'production' && 'secret');
  if (!val) {
    throw new ApiError(
      'Missing SECRET environment variable, which is required for user session management.'
    );
  }
  return val;
})();

export const DB_NAME = process.env.DB_NAME || 'bugtracker';
export const DB_URI = (() => {
  const { DB_URI } = process.env;
  const val =
    DB_URI || (NODE_ENV !== 'production' && 'mongodb://127.0.0.1:27017');
  if (!val) {
    throw new ApiError(
      'Missing DB_URI environment variable, which is required for database connection.'
    );
  }
  return val;
})();
