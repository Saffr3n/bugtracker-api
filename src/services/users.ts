import bcrypt from 'bcryptjs';
import User from '../models/user';
import { stringToCaseInsensitiveRegex } from '../utils';

interface CreateUserData extends Pick<UserDocument, 'username' | 'email'> {
  password: string;
}

export const getUserById = (id: string) => {
  return User.findById(id).exec();
};

export const getUserByUsername = (username: string) => {
  const regex = stringToCaseInsensitiveRegex(username);
  return User.findOne({ username: regex }).exec();
};

export const getUserByEmail = (email: string) => {
  const regex = stringToCaseInsensitiveRegex(email);
  return User.findOne({ email: regex }).exec();
};

export const getUserByUsernameOrEmail = (usernameOrEmail: string) => {
  const regex = stringToCaseInsensitiveRegex(usernameOrEmail);
  return User.findOne({ $or: [{ username: regex }, { email: regex }] }).exec();
};

export const createUser = async (data: CreateUserData) => {
  const { username, email, password } = data;
  const hash = await bcrypt.hash(password, 12);
  return await User.create({ username, email, hash });
};
