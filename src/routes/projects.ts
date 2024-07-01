import express from 'express';
import { createProject, getProjects } from '../controllers/projects';

const projectsRouter = express.Router();

projectsRouter.post('/', createProject);
projectsRouter.get('/', getProjects);

export default projectsRouter;
