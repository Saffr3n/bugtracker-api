import Ticket from '../../src/models/ticket';
import mockDb from './db';

export default () => {
  jest.spyOn(Ticket, 'create').mockImplementation((data) => {
    const ticket = new Ticket(data);
    mockDb.tickets.push(ticket);
    return Promise.resolve(ticket) as any;
  });
};
