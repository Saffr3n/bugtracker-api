import Project from '../models/project';
import { stringToCaseInsensitiveRegex } from '../utils';

type CreateProjectData = Pick<
  ProjectDocument,
  'title' | 'description' | 'manager'
>;

export const create = (data: CreateProjectData) => {
  return Project.create(data);
};

export const getByTitle = (title: string) => {
  const regex = stringToCaseInsensitiveRegex(title);
  return Project.findOne({ title: regex }).exec();
};
