import type { MongoClient } from 'mongodb';
import type { UserDocument as UserDoc } from './models/user';
import type { ApiError } from './utils/errors';

interface ApiResponseJson {
  status: number;
  title: string;
  detail: string;
}

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

declare module 'mongoose' {
  interface Connection {
    getClient(): MongoClient;
  }
}
