import { create } from '../services/tickets';
import {
  validateType,
  validatePriority,
  validateTitle,
  validateDetail,
  validateProject
} from '../validators/tickets';
import asyncHandler from '../middlewares/async-handler';
import checkAuthentication from '../middlewares/check-authentication';
import type { Request, Response, NextFunction } from 'express';

export const createTicket = [
  checkAuthentication(),

  validateType(),
  validatePriority(),
  validateTitle(),
  validateDetail(),
  validateProject(),

  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const ticket = await create({ ...req.body, submitter: req.user!.id });
    const json: SuccessResponseJson = {
      status: 200,
      title: 'Ticket Created',
      detail: `Ticket ${ticket.title} with id ${ticket.id} was successfully created.`,
      data: ticket.toJson()
    };

    res.status(json.status).json(json);
  })
];
