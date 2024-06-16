import express from 'express';
import { createTicket } from '../controllers/tickets';

const ticketsRouter = express.Router();

ticketsRouter.post('/', createTicket);

export default ticketsRouter;
