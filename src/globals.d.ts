import type { Document as Doc } from 'mongoose';
import type { MongoClient } from 'mongodb';
import type { UserDocument as UserDoc } from './models/user';
import type { ProjectDocument as ProjectDoc } from './models/project';
import type { ApiError } from './utils/errors';
import { USER_ROLES } from './constants/validation';

interface ApiResponseJson {
  status: number;
  title: string;
  detail: string;
}

export interface DocumentCommon {
  createDate: string | Date;
}

export interface DocumentJson extends DocumentCommon {
  id: string;
  url: string;
  createDate: string;
}

export interface DocumentRaw extends DocumentCommon {
  createDate: Date;
  toJson(): DocumentJson;
}

export interface Document extends DocumentRaw, Omit<Doc, 'toJSON'> {}

declare global {
  interface FailureResponseJson extends ApiResponseJson {
    type: string;
    stack?: string;
  }

  interface SuccessResponseJson extends ApiResponseJson {
    data?: any;
  }

  type UserRole = keyof typeof USER_ROLES;
  type UserDocument = UserDoc;
  type UserJson = ReturnType<UserDocument['toJson']>;

  type ProjectDocument = ProjectDoc;
  type ProjectJson = ReturnType<ProjectDocument['toJson']>;

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
