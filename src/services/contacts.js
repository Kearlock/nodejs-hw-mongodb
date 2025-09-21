import { contactsCollection } from '../db/model/contact.js';

export async function getAllContacts() {
  const contacts = await contactsCollection.find();
  return contacts;
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
