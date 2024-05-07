import { Router } from 'express';
import { createUser } from '../controllers/user';

const userRouter = Router();

userRouter.post('/', createUser);

export default userRouter;
