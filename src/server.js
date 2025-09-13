import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import 'dotenv/config';
import { getAllContacts, getContactById } from './services/contacts.js';

const setupServer = express();

setupServer.use(
  pino({
    transport: {
      target: 'pino-pretty',
    },
  }),
);

setupServer.use(cors());

setupServer.get('/contacts', async (req, res) => {
  const contactsData = await getAllContacts();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contactsData,
  });
});

setupServer.get('/contacts/:id', async (req, res) => {
  const id = req.params.id;
  const contactData = await getContactById(id);
  if (!contactData) {
    res.status(404).json({
      message: 'Contact not found',
    });
    return;
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data: contactData,
  });
});

setupServer.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

setupServer.use((err, req, res) => {
  res.status(500).json({
    message: 'Something went wrong',
    error: err.message,
  });
});

export default setupServer;
