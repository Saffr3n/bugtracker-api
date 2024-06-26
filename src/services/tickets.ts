import Ticket from '../models/ticket';

type CreationData = Pick<
  TicketDocument,
  'type' | 'title' | 'detail' | 'project' | 'submitter'
>;

export const create = (data: CreationData) => {
  return Ticket.create(data);
};
