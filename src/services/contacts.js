import { contactsCollection } from '../db/model/contact.js';

export async function getAllContacts() {
  const contacts = await contactsCollection.find();
  return contacts;
}

export async function getContactById(id) {
  const contact = await contactsCollection.findById(id);
  return contact;
}
