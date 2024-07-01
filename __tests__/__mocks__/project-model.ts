import Project from '../../src/models/project';
import { LIMIT_DEFAULT_VALUE } from '../../src/constants/validation';
import type { MockDB } from './db';

export default (db: MockDB) => {
  jest.spyOn(Project, 'create').mockImplementation((data) => {
    const project = new Project(data);
    db.projects.push(project);
    return Promise.resolve(project) as any;
  });

  jest.spyOn(Project, 'find').mockImplementation(() => {
    const projects: ProjectDocument[] = [];

    for (let i = 0; i < LIMIT_DEFAULT_VALUE; i++) {
      projects.push(db.projects[i]);
    }

    return { exec: () => Promise.resolve(projects) } as any;
  });

  jest.spyOn(Project, 'findById').mockImplementation((id) => {
    const project = db.projects.find((proj) => proj.id === id);
    return { exec: () => Promise.resolve(project) } as any;
  });
};
