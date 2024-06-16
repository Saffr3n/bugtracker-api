import Project from '../../src/models/project';
import mockDb from './db';

export default () => {
  jest.spyOn(Project, 'findById').mockImplementation((id) => {
    return {
      exec: () =>
        Promise.resolve(mockDb.projects.find((proj) => proj.id === id))
    } as any;
  });

  jest.spyOn(Project, 'findOne').mockImplementation((filter) => {
    const { title } = filter!;
    const findCb = (project: ProjectDocument) => {
      const regex: RegExp = title;
      return regex.test(project.title);
    };

    return {
      exec: () => Promise.resolve(mockDb.projects.find(findCb))
    } as any;
  });

  jest.spyOn(Project, 'create').mockImplementation((data) => {
    const project = new Project(data);
    mockDb.projects.push(project);
    return Promise.resolve(project) as any;
  });
};
