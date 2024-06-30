import { ApiError, ClientError, InternalServerError } from '../utils/errors';
import { NODE_ENV } from '../constants/env';
import type { Request, Response, NextFunction } from 'express';

export default (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!(err instanceof ApiError)) {
    err = new ApiError(err);
  }

  let clientErr: ClientError;

  if (err instanceof ClientError) {
    clientErr = err;
  } else {
    console.error(err);
    clientErr = new InternalServerError();
  }

  const json = clientErr.toJson(NODE_ENV !== 'production');
  res.status(json.status).json(json);
};
