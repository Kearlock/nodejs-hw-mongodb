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
import fs from 'node:fs';
import path from 'node:path';
import swaggerUI from 'swagger-ui-express';

const Server = express();

Server.use(
  pino({
    transport: {
      target: 'pino-pretty',
    },
  }),
);

const SWAGGER_DOCUMENT = JSON.parse(
  fs.readFileSync(path.join('docs', 'swagger.json')),
);

console.log(SWAGGER_DOCUMENT);

Server.use(cors());

Server.use('/api-docs', swaggerUI.serve, swaggerUI.setup(SWAGGER_DOCUMENT));

Server.use(express.json());

Server.use(cookieParser());

Server.use('/auth', usersRouter);

Server.use('/contacts', auth, contactsRouter);

Server.use(notFoundHandler);

Server.use(errorHandler);

export default Server;
