import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    hash: { type: String, required: true },
    role: {
      type: String,
      enum: ['Admin', 'Project Manager', 'Developer', 'User'],
      default: 'User'
    },
    registerDate: { type: Date, default: new Date() },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    avatarUrl: { type: String, required: false }
  },
  {
    collection: 'users',
    virtuals: {
      fullName: {
        get() {
          return `${this.firstName ?? ''} ${this.lastName ?? ''}`.trim();
        }
      },
      url: {
        get() {
          return `/users/${this.id}`;
        }
      }
    },
    methods: {
      normalize() {
        return {
          id: this.id as string,
          username: this.username,
          email: this.email,
          role: this.role,
          registerDate: this.registerDate.toISOString(),
          firstName: this.firstName,
          lastName: this.lastName,
          avatarUrl: this.avatarUrl
        };
      }
    }
  }
);

const User = mongoose.model('User', UserSchema);

export default User;
