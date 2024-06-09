import express from 'express';
import { getError } from '../controllers/errors';

const errorsRouter = express.Router();

errorsRouter.get('/:name', getError);

export default errorsRouter;
