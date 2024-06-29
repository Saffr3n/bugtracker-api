import mongoose from 'mongoose';
import { documentRefToJson } from '../utils';
import {
  TICKET_TYPES,
  TICKET_STATUSES,
  TICKET_PRIORITIES
} from '../constants/validation';
import type { DocumentCommon, DocumentJson, DocumentRaw } from '../globals';

interface TicketCommon extends DocumentCommon {
  type: TicketType;
  status: TicketStatus;
  priority: TicketPriority;
  title: string;
  detail: string;
  project: string | mongoose.Types.ObjectId | ProjectJson | ProjectDocument;
  submitter: string | mongoose.Types.ObjectId | UserJson | UserDocument;
  developers: (string | mongoose.Types.ObjectId | UserJson | UserDocument)[];
  createDate: string | Date;
}

export interface TicketJson extends TicketCommon, DocumentJson {
  id: string;
  url: string;
  project: string | ProjectJson;
  submitter: string | UserJson;
  developers: (string | UserJson)[];
  createDate: string;
}

export interface TicketRaw extends TicketCommon, DocumentRaw {
  project: mongoose.Types.ObjectId | ProjectDocument;
  submitter: mongoose.Types.ObjectId | UserDocument;
  developers: (mongoose.Types.ObjectId | UserDocument)[];
  createDate: Date;
  toJson(): TicketJson;
}

const TicketSchema = new mongoose.Schema<TicketRaw>(
  {
    type: { type: String, enum: TICKET_TYPES, required: true },
    status: { type: String, enum: TICKET_STATUSES, default: 'Open' },
    priority: { type: String, enum: TICKET_PRIORITIES, required: true },
    title: { type: String, required: true },
    detail: { type: String, required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    submitter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    developers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createDate: { type: Date, default: new Date() }
  },
  {
    collection: 'tickets',
    methods: {
      toJson(): TicketJson {
        return {
          id: this.id,
          url: `/tickets/${this.id}`,
          type: this.type,
          status: this.status,
          priority: this.priority,
          title: this.title,
          detail: this.detail,
          project: documentRefToJson(this.project),
          submitter: documentRefToJson(this.submitter),
          developers: documentRefToJson(this.developers),
          createDate: this.createDate.toISOString()
        };
      }
    }
  }
);

export type TicketDocument = Omit<
  mongoose.HydratedDocumentFromSchema<typeof TicketSchema>,
  'toJSON'
>;

type TicketModel = mongoose.Model<
  TicketRaw,
  {},
  {},
  {},
  TicketDocument,
  typeof TicketSchema
>;

export default mongoose.model('Ticket', TicketSchema) as TicketModel;
