import mongoose from 'mongoose';
import { USER_ROLES } from '../constants/validation';
import type { DocumentCommon, DocumentJson, DocumentRaw } from '../globals';

interface UserCommon extends DocumentCommon {
  username: string;
  email: string;
  role: UserRole;
  createDate: string | Date;
  avatarUrl?: string;
}

interface UserJson extends UserCommon, DocumentJson {
  id: string;
  url: string;
  createDate: string;
}

interface UserRaw extends UserCommon, DocumentRaw {
  hash: string;
  createDate: Date;
  toJson(): UserJson;
}

const UserSchema = new mongoose.Schema<UserRaw>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    hash: { type: String, required: true },
    role: { type: String, enum: USER_ROLES, default: 'User' },
    createDate: { type: Date, default: new Date() },
    avatarUrl: { type: String, required: false }
  },
  {
    collection: 'users',
    methods: {
      toJson(): UserJson {
        return {
          id: this.id as string,
          url: `/users/${this.username.toLowerCase().replaceAll(' ', '+')}`,
          username: this.username,
          email: this.email,
          role: this.role,
          createDate: this.createDate.toISOString(),
          avatarUrl: this.avatarUrl
        };
      }
    }
  }
);

export type UserDocument = Omit<
  mongoose.HydratedDocumentFromSchema<typeof UserSchema>,
  'toJSON'
>;

type UserModel = mongoose.Model<
  UserRaw,
  {},
  {},
  {},
  UserDocument,
  typeof UserSchema
>;

export default mongoose.model('User', UserSchema) as UserModel;
