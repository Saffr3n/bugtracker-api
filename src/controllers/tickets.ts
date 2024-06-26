import { create } from '../services/tickets';
import asyncHandler from '../middlewares/async-handler';
import checkAuthorization from '../middlewares/authorization';
import {
  validateType,
  validatePriority,
  validateTitle,
  validateDetail,
  validateProject
} from '../validators/tickets';

export const createTicket = [
  checkAuthorization().isAuthenticated(),

  validateType(),
  validatePriority(),
  validateTitle(),
  validateDetail(),
  validateProject(),

  asyncHandler(async (req, res) => {
    const ticket = await create({ ...req.body, submitter: req.user?.id });

    const json: SuccessResponseJson = {
      status: 200,
      title: 'Ticket Created',
      detail: `Ticket ${ticket.title} with id ${ticket.id} was successfully created.`,
      data: ticket.toJson()
    };

    res.status(json.status).json(json);
  })
];
