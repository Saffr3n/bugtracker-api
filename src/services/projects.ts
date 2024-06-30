import Project from '../models/project';

type CreationData = Pick<ProjectRaw, 'title' | 'detail' | 'manager'>;

export const create = (data: CreationData) => {
  return Project.create(data);
};

export const getById = (id: string) => {
  return Project.findById(id).exec();
};
