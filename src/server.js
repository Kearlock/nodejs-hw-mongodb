import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import 'dotenv/config';
// import { getAllContacts, getContactById } from './services/contacts.js';
import contactsRouter from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';

const Server = express();

Server.use(
  pino({
    transport: {
      target: 'pino-pretty',
    },
  }),
);

Server.use(cors());

Server.use(express.json());

Server.use('/contacts', contactsRouter);

Server.use(notFoundHandler);

Server.use(errorHandler);

export default Server;
