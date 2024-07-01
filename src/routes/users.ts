import express from 'express';
import {
  createUser,
  getUsers,
  getUser,
  editUser,
  deleteUser
} from '../controllers/users';

const usersRouter = express.Router();

usersRouter.post('/', createUser);
usersRouter.get('/', getUsers);
usersRouter.get('/:userId', getUser);
usersRouter.put('/:userId', editUser);
usersRouter.delete('/:userId', deleteUser);

export default usersRouter;
