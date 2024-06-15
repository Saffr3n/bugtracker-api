import mongoose from 'mongoose';
import { documentRefToJson } from '../utils';
import type { DocumentCommon, DocumentJson, DocumentRaw } from '../globals';

interface ProjectCommon extends DocumentCommon {
  title: string;
  description?: string;
  manager: string | mongoose.Types.ObjectId | UserJson | UserDocument;
  developers: (string | mongoose.Types.ObjectId | UserJson | UserDocument)[];
  createDate: string | Date;
}

export interface ProjectJson extends ProjectCommon, DocumentJson {
  id: string;
  url: string;
  manager: string | UserJson;
  developers: (string | UserJson)[];
  createDate: string;
}

interface ProjectRaw extends ProjectCommon, DocumentRaw {
  manager: mongoose.Types.ObjectId | UserDocument;
  developers: (mongoose.Types.ObjectId | UserDocument)[];
  createDate: Date;
  toJson(): ProjectJson;
}

const ProjectSchema = new mongoose.Schema<ProjectRaw>(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    developers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createDate: { type: Date, default: new Date() }
  },
  {
    collection: 'projects',
    methods: {
      toJson(): ProjectJson {
        return {
          id: this.id as string,
          url: `/projects/${this.title.toLowerCase().replaceAll(' ', '+')}`,
          title: this.title,
          description: this.description,
          manager: documentRefToJson(this.manager),
          developers: documentRefToJson(this.developers),
          createDate: this.createDate.toISOString()
        };
      }
    }
  }
);

export type ProjectDocument = Omit<
  mongoose.HydratedDocumentFromSchema<typeof ProjectSchema>,
  'toJSON'
>;

type ProjectModel = mongoose.Model<
  ProjectRaw,
  {},
  {},
  {},
  ProjectDocument,
  typeof ProjectSchema
>;

export default mongoose.model('Project', ProjectSchema) as ProjectModel;
