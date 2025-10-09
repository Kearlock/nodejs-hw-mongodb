import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import contactsRouter from './routers/contacts.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import usersRouter from './routers/auth.js';
import { auth } from './middlewares/auth.js';

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

Server.use(cookieParser());

Server.use('/auth', usersRouter);

Server.use('/contacts', auth, contactsRouter);

Server.use(notFoundHandler);

Server.use(errorHandler);

export default Server;
