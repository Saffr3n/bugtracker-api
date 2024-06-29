import express from 'express';
import { createUser, getUsers, getUser, editUser } from '../controllers/users';

const usersRouter = express.Router();

usersRouter.post('/', createUser);
usersRouter.get('/', getUsers);
usersRouter.get('/:userId', getUser);
usersRouter.put('/:userId', editUser);

export default usersRouter;
