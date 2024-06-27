import express from 'express';
import { createUser, getUsers, getUser } from '../controllers/users';

const usersRouter = express.Router();

usersRouter.post('/', createUser);
usersRouter.get('/', getUsers);
usersRouter.get('/:userId', getUser);

export default usersRouter;
