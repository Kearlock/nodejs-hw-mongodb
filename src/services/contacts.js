import { contactsCollection } from '../db/model/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export async function getAllContacts({ page, perPage, sort, filter, userId }) {
  const skip = page > 0 ? (page - 1) * perPage : 0;
  filter.userId = userId;
  const contactsQuery = contactsCollection.find(filter);
  const [contacts, totalItems] = await Promise.all([
    contactsQuery.sort(sort).skip(skip).limit(perPage),
    contactsCollection.find(filter).countDocuments(),
  ]);
  console.log('queryFilter:', filter);

  return { contacts, ...calculatePaginationData(totalItems, page, perPage) };
}

export async function getContactById(id) {
  const contact = await contactsCollection.findById(id);
  return contact;
}

export async function newContact(payload) {
  const contact = await contactsCollection.create(payload);
  return contact;
}

export async function editContactById(id, payload) {
  const contact = await contactsCollection.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return contact;
}

export async function deleteContactById(id) {
  return contactsCollection.findByIdAndDelete(id);
}
