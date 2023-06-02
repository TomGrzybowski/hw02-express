const fs = require("fs/promises");
const { nanoid } = require("nanoid");
const path = require("path");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const contactsData = await fs.readFile(contactsPath, "utf-8");

  const contacts = JSON.parse(contactsData);

  return contacts;
};

const getContactById = async (contactId) => {
  const contactsData = await fs.readFile(contactsPath, "utf-8");

  const contacts = JSON.parse(contactsData);

  const finalContact = contacts.filter((contact) => contact.id === contactId);

  return finalContact;
};

const removeContact = async (contactId) => {
  const contactsData = await fs.readFile(contactsPath, "utf-8");

  const contacts = JSON.parse(contactsData);

  const index = contacts.findIndex((contact) => contact.id === contactId);

  if (index !== -1) {
    const deletedContact = contacts.splice(index, 1)[0];

    const updatedContactsData = JSON.stringify(contacts);

    await fs.writeFile(contactsPath, updatedContactsData, "utf-8");

    return deletedContact;
  } else {
    return false;
  }
};

const addContact = async (body) => {
  const contactsData = await fs.readFile(contactsPath, "utf-8");

  const contacts = JSON.parse(contactsData);

  const newContact = body;
  newContact.id = nanoid();

  if (
    body.name === undefined ||
    body.email === undefined ||
    body.phone === undefined
  )
    return false;

  contacts.push(newContact);

  const updatedContactsData = JSON.stringify(contacts);

  await fs.writeFile(contactsPath, updatedContactsData, "utf-8");

  return true;
};

const updateContact = async (contactId, body) => {
  const contactsData = await fs.readFile(contactsPath, "utf-8");

  const contacts = JSON.parse(contactsData);

  const index = contacts.findIndex((contact) => contact.id === contactId);

  if (index !== -1) {
    const updatedContact = body;

    contacts[index] = { ...contacts[index], ...updatedContact };

    const updatedContactsData = JSON.stringify(contacts);

    await fs.writeFile(contactsPath, updatedContactsData, "utf-8");

    return contacts[index];
  } else {
    return false;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
