import {
  getAllContacts,
  getContactById,
  newContact,
  editContactById,
  deleteContactById,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import {
  parseSortParams,
  parseFilterParams,
} from '../utils/parseAdditionParams.js';

export async function getAllContactsCtr(req, res) {
  const { page, perPage } = parsePaginationParams(req.query);
  const sort = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  console.log('userId:', req.user.id, 'filter:', filter);

  const contactsData = await getAllContacts({
    page,
    perPage,
    sort,
    filter,
    userId: req.user.id,
  });
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contactsData,
  });
}

export async function getContactByIdCtr(req, res, next) {
  console.log('userId:', contactData.userId.toString());
  const id = req.params.id;
  const contactData = await getContactById(id);
  if (!contactData) {
    throw new createHttpError.NotFound('Contact not found');
  }
  if (contactData.userId.toString() !== req.user.id.toString()) {
    throw new createHttpError.Forbidden('Contact unavailable');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data: contactData,
  });
}

export async function newContactCtr(req, res) {
  const contact = await newContact({ ...req.body, userId: req.user.id });
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
}

export async function editContactByIdCtr(req, res, next) {
  const id = req.params.id;
  const data = req.body;
  const updatedContact = await editContactById(id, data);
  if (!updatedContact) {
    throw new createHttpError.NotFound('Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
}

export async function deleteContactCtr(req, res, next) {
  const id = req.params.id;
  const result = await deleteContactById(id);
  if (result === null) {
    throw new createHttpError.NotFound('Contact not found');
  }
  res.status(204).send();
}
