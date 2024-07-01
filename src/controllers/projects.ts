import { create } from '../services/projects';
import asyncHandler from '../middlewares/async-handler';
import checkAuthorization from '../middlewares/authorization';
import { validateTitle, validateDetail } from '../validators/projects';

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
