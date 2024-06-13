import express from 'express';
import { createProject } from '../controllers/projects';

const projectsRouter = express.Router();

projectsRouter.post('/', createProject);

export default projectsRouter;
