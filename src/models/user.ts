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
    avatarUrl: { type: String, required: false }
  },
  {
    collection: 'users',
    virtuals: {
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
          avatarUrl: this.avatarUrl
        };
      }
    }
  }
);

const User = mongoose.model('User', UserSchema);

export default User;
