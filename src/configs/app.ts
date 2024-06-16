import express from 'express';
import logger from 'morgan';
import session from './session';
import passport from './passport';
import sessionRouter from '../routes/session';
import usersRouter from '../routes/users';
import projectsRouter from '../routes/projects';
import ticketsRouter from '../routes/tickets';
import errorsRouter from '../routes/errors';
import errorHandler from '../middlewares/error-handler';
import { PathNotFoundError } from '../utils/errors';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session());
app.use(passport.initialize());
app.use(passport.session());

app.use('/session', sessionRouter);
app.use('/users', usersRouter);
app.use('/projects', projectsRouter);
app.use('/tickets', ticketsRouter);
app.use('/errors', errorsRouter);

app.use((req, res, next) => next(new PathNotFoundError()));
app.use(errorHandler);

export default app;
