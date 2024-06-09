import mongoose from 'mongoose';

export const USER_ROLES = [
  'Admin',
  'Project Manager',
  'Developer',
  'User'
] as const;

type UserRole = (typeof USER_ROLES)[number];

interface UserCommon {
  username: string;
  email: string;
  role: UserRole;
  registerDate: string | Date;
  avatarUrl?: string;
}

interface UserJson extends UserCommon {
  id: string;
  url: string;
  registerDate: string;
}

interface UserRaw extends UserCommon {
  hash: string;
  registerDate: Date;
  toJson(): UserJson;
}

const UserSchema = new mongoose.Schema<UserRaw>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    hash: { type: String, required: true },
    role: { type: String, enum: USER_ROLES, default: 'User' },
    registerDate: { type: Date, default: new Date() },
    avatarUrl: { type: String, required: false }
  },
  {
    collection: 'users',
    methods: {
      toJson(): UserJson {
        return {
          id: this.id as string,
          url: `/users/${this.username.toLowerCase()}`,
          username: this.username,
          email: this.email,
          role: this.role,
          registerDate: this.registerDate.toISOString(),
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
