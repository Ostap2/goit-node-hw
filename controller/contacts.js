const { HttpError, controllerWrapper } = require("../erorr");
const { Contact } = require("../models/contact");

const listContacts = controllerWrapper(async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  const contacts = await Contact.find({ owner }, "-createdAt -updatedAt", { skip, limit }).populate("owner", "email");

  res.status(200).json(contacts);
});

const getContactById = controllerWrapper(async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);

  if (!contact) {
    throw HttpError(404, "Not Found");
  }

  res.status(200).json(contact);
});

const addContact = controllerWrapper(async (req, res) => {
  const { _id: owner } = req.user;
  const contact = await Contact.create({ ...req.body, owner });

  res.status(201).json(contact);
});

const removeContact = controllerWrapper(async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contact.findByIdAndDelete(contactId);

  if (!contact) {
    throw HttpError(404, "Not Found");
  }

  res.json({
    message: "Contact deleted",
  });
});

const updateContact = controllerWrapper(async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });

  if (!contact) {
    throw HttpError(404, "Not Found");
  }

  res.status(200).json(contact);
});

const updateFavorite = controllerWrapper(async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });

  if (!contact) {
    throw HttpError(404, "Not Found");
  }

  res.status(200).json(contact);
});

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateFavorite,
};
