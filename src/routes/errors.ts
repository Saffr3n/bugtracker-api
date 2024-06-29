import express from 'express';
import { getError } from '../controllers/errors';

const errorsRouter = express.Router();

errorsRouter.get('/:errorName', getError);

export default errorsRouter;
