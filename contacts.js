const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function readFile() {
  return fs.readFile(contactsPath, "utf-8");
}

async function writeFile(data) {
  return fs.writeFile(contactsPath, data, "utf-8");
}

async function getAllContacts() {
  try {
    const contactsData = await readFile();
    return JSON.parse(contactsData.toString());
  } catch (error) {
    throw new Error("Error getting all contacts");
  }
}

async function addContact(newContact) {
  try {
    const contacts = await getAllContacts();
    newContact.id = generateUniqueId();
    contacts.push(newContact);
    await writeFile(JSON.stringify(contacts, null, 2));
    return newContact;
  } catch (error) {
    throw new Error("Error adding contact");
  }
}

const { v4: uuidv4 } = require("uuid");

function generateUniqueId() {
  return uuidv4().replace(/-/g, "").substr(0, 21);
}

async function listContacts() {
  try {
    const contactsData = await readFile();
    const contactsArray = JSON.parse(contactsData.toString());
    return contactsArray;
  } catch (error) {
    throw new Error("Error listing contacts");
  }
}

async function getContactById(contactId) {
  try {
    const contactsData = await readFile();
    const contactsArray = JSON.parse(contactsData.toString());
    const contact = contactsArray.find((c) => c.id === contactId);
    return contact || null;
  } catch (error) {
    throw new Error("Error getting contact by ID");
  }
}
async function removeContact(contactId) {
  try {
    const contacts = await getAllContacts();
    const updatedContacts = contacts.filter(
      (contact) => contact.id !== contactId
    );
    await writeFile(JSON.stringify(updatedContacts, null, 2));
    return true;
  } catch (error) {
    throw new Error("Error removing contact");
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await getAllContacts();
    const isNameDuplicate = contacts.some((contact) => contact.name === name);
    if (isNameDuplicate) {
      throw new Error(`Contact with the name '${name}' already exists.`);
    }
    const isEmailDuplicate = contacts.some(
      (contact) => contact.email === email
    );
    if (isEmailDuplicate) {
      throw new Error(`Contact with the email '${email}' already exists.`);
    }

    const newContact = {
      id: generateUniqueId(),
      name,
      email,
      phone,
    };

    contacts.push(newContact);
    await writeFile(JSON.stringify(contacts, null, 2));

    return newContact;
  } catch (error) {
    throw new Error("Error adding contact: " + error.message);
  }
}

module.exports = {
  readFile,
  writeFile,
  getAllContacts,
  addContact,
  listContacts,
  getContactById,
  removeContact,
};
