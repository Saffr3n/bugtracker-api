import Ticket from '../models/ticket';

type CreateTicketData = Pick<
  TicketDocument,
  'type' | 'title' | 'detail' | 'project' | 'submitter'
>;

export const create = (data: CreateTicketData) => {
  return Ticket.create(data);
};
