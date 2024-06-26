import bcrypt from 'bcryptjs';
import User from '../models/user';
import { stringToCaseInsensitiveRegex } from '../utils';
import type { ParsedQs } from 'qs';

interface CreationData extends Pick<UserDocument, 'username' | 'email'> {
  password: string;
}

export const create = async (data: CreationData) => {
  const { username, email, password } = data;
  const hash = await bcrypt.hash(password, 12);
  return await User.create({ username, email, hash });
};

export const getAll = (options: ParsedQs) => {
  const { limit = 20, page = 1, sort } = options;
  const skip = limit * (page - 1);
  return User.find({}, {}, { limit, skip, sort }).exec();
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
