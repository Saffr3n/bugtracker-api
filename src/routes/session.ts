import express from 'express';
import { login, logout } from '../controllers/session';

const sessionRouter = express.Router();

sessionRouter.post('/', login);
sessionRouter.delete('/', logout);

export default sessionRouter;
