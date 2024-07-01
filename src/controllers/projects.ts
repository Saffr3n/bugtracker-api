import Project from '../models/project';
import { create, getAll } from '../services/projects';
import asyncHandler from '../middlewares/async-handler';
import checkAuthorization from '../middlewares/authorization';
import { validateTitle, validateDetail } from '../validators/projects';
import { validateLimit, validatePage, validateSort } from '../validators';

export const createProject = [
  checkAuthorization().isAuthenticated().isRole('Project Manager'),

  validateTitle(),
  validateDetail(),

  asyncHandler(async (req, res) => {
    const project = await create({ ...req.body, manager: req.user?.id });

    const json: SuccessResponseJson = {
      status: 200,
      title: 'Project Created',
      detail: `Project ${project.title} with id ${project.id} was successfully created.`,
      data: project.toJson()
    };

    res.status(json.status).json(json);
  })
];

export const getProjects = [
  validateLimit(),
  validatePage(),
  validateSort(Project),

  asyncHandler(async (req, res) => {
    const projects = await getAll(req.query);

    const json: SuccessResponseJson = {
      status: 200,
      title: 'Projects Retrieved',
      detail: `Page ${
        req.query.page || 1
      } of projects collection was successfully retrieved.`,
      data: projects.map((project) => project.toJson())
    };

    res.status(json.status).json(json);
  })
];
