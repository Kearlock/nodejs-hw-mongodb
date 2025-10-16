import { Router } from 'express';
import {
  getAllContactsCtr,
  getContactByIdCtr,
  newContactCtr,
  editContactByIdCtr,
  deleteContactCtr,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import {
  createContactShema,
  updateContactShema,
} from '../validation/contacts.js';
import { isValidID } from '../middlewares/isValidId.js';

import { upload } from '../middlewares/uploadPhoto.js';

const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(getAllContactsCtr));

contactsRouter.get('/:id', isValidID, ctrlWrapper(getContactByIdCtr));

contactsRouter.post(
  '/',
  upload.single('photo'),
  validateBody(createContactShema),
  ctrlWrapper(newContactCtr),
);

contactsRouter.patch(
  '/:id',
  isValidID,
  upload.single('photo'),
  validateBody(updateContactShema),
  ctrlWrapper(editContactByIdCtr),
);

contactsRouter.delete('/:id', isValidID, ctrlWrapper(deleteContactCtr));

export default contactsRouter;
