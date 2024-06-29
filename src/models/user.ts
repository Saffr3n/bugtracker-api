import mongoose from 'mongoose';
import { USER_ROLES } from '../constants/validation';
import type { DocumentCommon, DocumentJson, DocumentRaw } from '../globals';

interface UserCommon extends DocumentCommon {
  username: string;
  email?: string;
  role: UserRole;
  createDate: string | Date;
  avatarUrl?: string;
}

export interface UserJson extends UserCommon, DocumentJson {
  id: string;
  url: string;
  email?: string;
  createDate: string;
}

export interface UserRaw extends UserCommon, DocumentRaw {
  email: string;
  hash: string;
  createDate: Date;
  /** @param [includeEmail=false] - Default: `false` */
  toJson(includeEmail?: boolean): UserJson;
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
      toJson(includeEmail: boolean = false): UserJson {
        const json: UserJson = {
          id: this.id,
          url: `/users/${this.id}`,
          username: this.username,
          role: this.role,
          createDate: this.createDate.toISOString(),
          avatarUrl: this.avatarUrl
        };

        if (includeEmail) json.email = this.email;
        return json;
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
