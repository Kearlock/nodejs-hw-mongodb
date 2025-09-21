import { Router } from 'express';
import {
  getAllContactsCtr,
  getContactByIdCtr,
  newContactCtr,
  editContactByIdCtr,
  deleteContactCtr,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(getAllContactsCtr));

contactsRouter.get('/:id', ctrlWrapper(getContactByIdCtr));
// contactsRouter.get('/:id', getContactByIdCtr);

contactsRouter.post('/', ctrlWrapper(newContactCtr));

contactsRouter.patch('/:id', ctrlWrapper(editContactByIdCtr));

contactsRouter.delete('/:id', ctrlWrapper(deleteContactCtr));

export default contactsRouter;
