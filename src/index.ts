import dbConnect from './configs/mongoose';
import { PORT } from './constants/env';
import type { Application } from 'express';

dbConnect().then(() => {
  const app: Application = require('./configs/app').default;
  app.listen(PORT, () => console.log(`App is running on port ${PORT}`));
});
