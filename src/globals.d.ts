import type { Document as Doc } from 'mongoose';
import type { MongoClient } from 'mongodb';
import type { UserDocument as UDoc, UserJson as UJson } from './models/user';
import type {
  ProjectDocument as PDoc,
  ProjectJson as PJson
} from './models/project';
import type {
  TicketDocument as TDoc,
  TicketJson as TJson
} from './models/ticket';
import type { ApiError } from './utils/errors';
import {
  USER_ROLES,
  TICKET_TYPES,
  TICKET_STATUSES
} from './constants/validation';

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
  type UserDocument = UDoc;
  type UserJson = UJson;

  type ProjectDocument = PDoc;
  type ProjectJson = PJson;

  type TicketType = (typeof TICKET_TYPES)[number];
  type TicketStatus = (typeof TICKET_STATUSES)[number];
  type TicketDocument = TDoc;
  type TicketJson = TJson;

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
