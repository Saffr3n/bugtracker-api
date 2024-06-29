import { create } from '../services/projects';
import { validateTitle, validateDetail } from '../validators/projects';
import asyncHandler from '../middlewares/async-handler';
import isAuthenticated from '../middlewares/authorization';
import type { Request, Response } from 'express';

export const createProject = [
  isAuthenticated().isRole('Project Manager'),

  validateTitle(),
  validateDetail(),

  asyncHandler(async (req: Request, res: Response) => {
    const project = await create({ ...req.body, manager: req.user!.id });
    const json: SuccessResponseJson = {
      status: 200,
      title: 'Project Created',
      detail: `Project ${project.title} with id ${project.id} was successfully created.`,
      data: project.toJson()
    };

    res.status(json.status).json(json);
  })
];
