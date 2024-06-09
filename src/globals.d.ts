import type { HydratedDocumentFromSchema } from 'mongoose';
import type { UserDocument as UserDoc } from './models/user';
import type { ApiError } from './utils/errors';

declare global {
  interface FailureResponseJson extends ApiResponseJson {
    type: string;
    stack?: string;
  }

  interface SuccessResponseJson extends ApiResponseJson {
    data?: any;
  }

  type UserDocument = UserDoc;

  namespace Express {
    interface Request {
      error?: ApiError;
    }

    interface Locals {
      user?: UserDocument;
    }

    interface User extends UserDocument {}
  }
}

interface ApiResponseJson {
  status: number;
  title: string;
  detail: string;
}
