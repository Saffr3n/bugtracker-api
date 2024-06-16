import { create } from '../services/tickets';
import {
  validateType,
  validateTitle,
  validateDetail,
  validateProject
} from '../validators/tickets';
import checkAuthentication from '../middlewares/check-authentication';
import { ApiError } from '../utils/errors';
import type { Request, Response, NextFunction } from 'express';

export const createTicket = [
  checkAuthentication(),
  validateType(),
  validateTitle(),
  validateDetail(),
  validateProject(),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const err = req.error;
      if (err) return next(err);

      const ticket = await create({ ...req.body, submitter: req.user!.id });
      const json: SuccessResponseJson = {
        status: 200,
        title: 'Ticket Created',
        detail: `Ticket ${ticket.title} with id ${ticket.id} was successfully created.`,
        data: ticket.toJson()
      };

      res.status(json.status).json(json);
    } catch (err) {
      next(new ApiError(err));
    }
  }
];
