import { Router } from 'express';
import { login, logout } from '../controllers/session';

const sessionRouter = Router();

sessionRouter.post('/', login);
sessionRouter.delete('/', logout);

export default sessionRouter;
