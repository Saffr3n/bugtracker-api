import express from 'express';
import { register } from '../controllers/users';

const usersRouter = express.Router();

usersRouter.post('/', register);

export default usersRouter;
