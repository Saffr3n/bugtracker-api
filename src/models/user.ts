import mongoose from 'mongoose';

const userRoles = ['Admin', 'Project Manager', 'Developer', 'User'] as const;

type UserRole = (typeof userRoles)[number];

interface User {
  readonly username: string;
  readonly email: string;
  readonly hash: string;
  readonly role: UserRole;
  readonly registerDate: Date;
  readonly avatarUrl?: string;
  normalize(): UserNormalized;
}

interface UserNormalized {
  readonly id: string;
  readonly url: string;
  readonly username: string;
  readonly email: string;
  readonly role: UserRole;
  readonly registerDate: string;
  readonly avatarUrl?: string;
}

const UserSchema = new mongoose.Schema<User>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    hash: { type: String, required: true },
    role: {
      type: String,
      enum: userRoles,
      default: 'User'
    },
    registerDate: { type: Date, default: new Date() },
    avatarUrl: { type: String, required: false }
  },
  {
    collection: 'users',
    methods: {
      normalize(): UserNormalized {
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

const User = mongoose.model('User', UserSchema);

export default User;
