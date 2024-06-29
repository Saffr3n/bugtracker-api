import Ticket from '../../src/models/ticket';
import type { MockDB } from './db';

export default (db: MockDB) => {
  jest.spyOn(Ticket, 'create').mockImplementation((data) => {
    const ticket = new Ticket(data);
    db.tickets.push(ticket);
    return Promise.resolve(ticket) as any;
  });
};
