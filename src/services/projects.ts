import Project from '../models/project';
import { LIMIT_DEFAULT_VALUE } from '../constants/validation';
import type { ParsedQs } from 'qs';

type CreationData = Pick<ProjectRaw, 'title' | 'detail' | 'manager'>;

export const create = (data: CreationData) => {
  return Project.create(data);
};

export const getAll = (options: ParsedQs) => {
  const { limit = LIMIT_DEFAULT_VALUE, page = 1, sort } = options;
  const skip = limit * (page - 1);
  return Project.find({}, {}, { limit, skip, sort }).exec();
};

export const getById = (id: string) => {
  return Project.findById(id).exec();
};
