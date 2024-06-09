import mongoose from 'mongoose';
import { ApiError } from '../utils/errors';
import { DB_URI, DB_NAME } from '../constants/env';

mongoose.set('strictQuery', false);

mongoose.connection.on('connecting', () => {
  console.info('Connecting to MongoDB');
});

mongoose.connection.on('connected', () => {
  console.info('Connected to MongoDB');
});

mongoose.connection.on('disconnected', () => {
  console.warn('Disconnected from MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Error connecting to MongoDB');
  throw new ApiError(err);
});

export default () => mongoose.connect(DB_URI, { dbName: DB_NAME });
