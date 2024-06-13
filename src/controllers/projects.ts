import { create } from '../services/projects';
import { validateTitle, validateDescription } from '../validators/projects';
import checkUserRole from '../middlewares/check-user-role';
import { ApiError } from '../utils/errors';
import type { Request, Response, NextFunction } from 'express';

export const createProject = [
  checkUserRole('Project Manager'),
  validateTitle(),
  validateDescription(),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const err = req.error;
      if (err) return next(err);

      const project = await create({ ...req.body, manager: req.user!.id });
      const json: SuccessResponseJson = {
        status: 200,
        title: 'Project Created',
        detail: `Project ${project.title} with id ${project.id} was successfully created.`,
        data: project.toJson()
      };

      res.status(json.status).json(json);
    } catch (err) {
      next(new ApiError(err));
    }
  }
];
