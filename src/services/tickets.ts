import Ticket from '../models/ticket';
import Project from '../models/project';
import { ProjectNotFoundError } from '../utils/errors';

type CreationData = Pick<
  TicketRaw,
  'type' | 'title' | 'detail' | 'project' | 'submitter'
>;

export const create = async (data: CreationData) => {
  const { project: id } = data;
  const project = await Project.findById(id).exec();
  if (!project) throw new ProjectNotFoundError();
  return await Ticket.create(data);
};
