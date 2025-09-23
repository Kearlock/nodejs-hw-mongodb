import { Router } from 'express';
import {
  getAllContactsCtr,
  getContactByIdCtr,
  newContactCtr,
  editContactByIdCtr,
  deleteContactCtr,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactShema,
  updateContactShema,
} from '../validation/contacts.js';
import { isValidID } from '../middlewares/isValidId.js';

const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(getAllContactsCtr));

contactsRouter.get('/:id', isValidID, ctrlWrapper(getContactByIdCtr));
// contactsRouter.get('/:id', getContactByIdCtr);

contactsRouter.post(
  '/',
  validateBody(createContactShema),
  ctrlWrapper(newContactCtr),
);

contactsRouter.patch(
  '/:id',
  isValidID,
  validateBody(updateContactShema),
  ctrlWrapper(editContactByIdCtr),
);

contactsRouter.delete('/:id', isValidID, ctrlWrapper(deleteContactCtr));

export default contactsRouter;
