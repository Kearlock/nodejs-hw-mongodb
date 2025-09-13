import process from 'process';
import mongoose from 'mongoose';
import 'dotenv/config';

export default async function initMongoConnection() {
  try {
    const user = process.env.MONGODB_USER;
    const pwd = process.env.MONGODB_PASSWORD;
    const url = process.env.MONGODB_URL;
    const db = process.env.MONGODB_DB;

    await mongoose.connect(
      `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`,
    );
    console.info('Mongo connection successfully established!');
  } catch (e) {
    console.error('Error while setting up mongo connection', e);
    throw e;
  }
}
