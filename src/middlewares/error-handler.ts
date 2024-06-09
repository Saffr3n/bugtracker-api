import {
  InternalServerError,
  type ApiError,
  type ClientError
} from '../utils/errors';
import { NODE_ENV } from '../constants/env';
import type { Request, Response, NextFunction } from 'express';

const isClientError = (err: ApiError): err is ClientError => {
  return (err as ClientError).type !== undefined;
};

export default (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let clientErr: ClientError;

  if (isClientError(err)) {
    clientErr = err;
  } else {
    console.error(err);
    clientErr = new InternalServerError();
  }

  const json = clientErr.toJson(NODE_ENV !== 'production');
  res.status(json.status).json(json);
};
