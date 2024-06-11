import mongoose from 'mongoose';

interface ProjectCommon {
  title: string;
  description?: string;
  manager: mongoose.Types.ObjectId;
  developers: mongoose.Types.ObjectId[];
  users: mongoose.Types.ObjectId[];
  createDate: string | Date;
}

interface ProjectJson extends ProjectCommon {
  id: string;
  url: string;
  createDate: string;
}

interface ProjectRaw extends ProjectCommon {
  createDate: Date;
  toJson(): ProjectJson;
}

const ProjectSchema = new mongoose.Schema<ProjectRaw>(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    developers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
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
          manager: this.manager,
          developers: this.developers,
          users: this.users,
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
