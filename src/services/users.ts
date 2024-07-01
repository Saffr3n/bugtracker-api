import bcrypt from 'bcryptjs';
import User from '../models/user';
import { stringToCaseInsensitiveRegex } from '../utils';
import { LIMIT_DEFAULT_VALUE } from '../constants/validation';
import type { ParsedQs } from 'qs';

interface CreationData extends Pick<UserRaw, 'username' | 'email'> {
  password: string;
}

interface EditionData
  extends Partial<Pick<UserRaw, 'username' | 'email' | 'role'>> {
  newPassword?: string;
}

export const create = async (data: CreationData) => {
  const { username, email, password } = data;
  const hash = await bcrypt.hash(password, 12);
  return await User.create({ username, email, hash });
};

export const getAll = (options: ParsedQs) => {
  const { limit = LIMIT_DEFAULT_VALUE, page = 1, sort } = options;
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

export const getByIdAndEdit = async (id: string, data: EditionData) => {
  const { username, email, role, newPassword } = data;
  const hash = newPassword && (await bcrypt.hash(newPassword, 12));
  const update = { username, email, role, hash };
  return await User.findByIdAndUpdate(id, update, { new: true }).exec();
};

export const getByIdAndDelete = (id: string) => {
  return User.findByIdAndDelete(id).exec();
};
