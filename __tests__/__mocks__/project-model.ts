import Project from '../../src/models/project';
import type { MockDB } from './db';

export default (db: MockDB) => {
  jest.spyOn(Project, 'findById').mockImplementation((id) => {
    const project = db.projects.find((proj) => proj.id === id);
    return { exec: () => Promise.resolve(project) } as any;
  });

  jest.spyOn(Project, 'findOne').mockImplementation((filter) => {
    const { title } = filter!;
    const project = db.projects.find((project) => {
      const regex: RegExp = title;
      return regex.test(project.title);
    });

    return { exec: () => Promise.resolve(project) } as any;
  });

  jest.spyOn(Project, 'create').mockImplementation((data) => {
    const project = new Project(data);
    db.projects.push(project);
    return Promise.resolve(project) as any;
  });
};
