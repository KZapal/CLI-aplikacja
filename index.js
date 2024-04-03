const contacts = require("./contacts");
const { readFile, writeFile } = require("./contacts");

const { Command } = require("commander");
const program = new Command();

program
  .option("-a, --action <type>", "choose action")
  .option("-i, --id <type>", "user id")
  .option("-n, --name <type>", "user name")
  .option("-e, --email <type>", "user email")
  .option("-p, --phone <type>", "user phone");

program.parse(process.argv);

const argv = program.opts();

async function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
      listContacts();
      break;

    case "get":
      getContactById(id);
      break;

    case "add":
      addContact(name, email, phone);
      break;

    case "remove":
      removeContact(id);
      break;

    default:
      console.warn("\x1B[31m Unknown action type!");
  }
}

async function listContacts() {
  try {
    const contactsData = await readFile();
    const contactsArray = JSON.parse(contactsData.toString());

    console.table(contactsArray);
  } catch (error) {
    console.error(`Wystąpił błąd: ${error.message}`);
  }
}

async function getContactById(contactId) {
  try {
    const contact = await contacts.getContactById(contactId);
    if (contact) {
      console.table([contact]);
    } else {
      console.log(`Nie znaleziono kontaktu o ID: ${contactId}`);
    }
  } catch (error) {
    console.error(`Wystąpił błąd: ${error.message}`);
  }
}

async function removeContact(contactId) {
  try {
    const success = await contacts.removeContact(contactId);
    if (success) {
      console.log(`Kontakt o ID ${contactId} został usunięty.`);
    } else {
      console.log(`Nie znaleziono kontaktu o ID: ${contactId}`);
    }
  } catch (error) {
    console.error(`Wystąpił błąd: ${error.message}`);
  }
}

async function addContact(name, email, phone) {
  try {
    const newContact = await contacts.addContact(name, email, phone);
    console.log("Nowy kontakt:", newContact);
  } catch (error) {
    console.error(`Wystąpił błąd: ${error.message}`);
  }
}

invokeAction(argv);
