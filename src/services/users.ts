import bcrypt from 'bcryptjs';
import User from '../models/user';
import { stringToCaseInsensitiveRegex } from '../utils';

interface CreateUserData extends Pick<UserDocument, 'username' | 'email'> {
  password: string;
}

export const create = async (data: CreateUserData) => {
  const { username, email, password } = data;
  const hash = await bcrypt.hash(password, 12);
  return await User.create({ username, email, hash });
};

export const getById = (id: string) => {
  return User.findById(id).exec();
};

export const getByUsername = (username: string) => {
  const regex = stringToCaseInsensitiveRegex(username);
  return User.findOne({ username: regex }).exec();
};

export const getByEmail = (email: string) => {
  const regex = stringToCaseInsensitiveRegex(email);
  return User.findOne({ email: regex }).exec();
};

export const getByUsernameOrEmail = (usernameOrEmail: string) => {
  const regex = stringToCaseInsensitiveRegex(usernameOrEmail);
  return User.findOne({ $or: [{ username: regex }, { email: regex }] }).exec();
};
