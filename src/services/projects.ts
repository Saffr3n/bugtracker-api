import Project from '../models/project';
import { stringToCaseInsensitiveRegex } from '../utils';

type CreateProjectData = Pick<ProjectDocument, 'title' | 'detail' | 'manager'>;

export const create = (data: CreateProjectData) => {
  return Project.create(data);
};

export const getByTitle = (title: string) => {
  const regex = stringToCaseInsensitiveRegex(title);
  return Project.findOne({ title: regex }).exec();
};

export const getById = (id: string) => {
  return Project.findById(id).exec();
};
