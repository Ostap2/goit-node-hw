const express = require('express');
const router = express.Router();
const contactsController = require('./contactsController');
const { validateContact } = require('./contactsValidation');

router.post('/', async (req, res, next) => {
  const { error } = validateContact(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { name, email, phone } = req.body;

  try {
    const newContact = await contactsController.addContact({ name, email, phone });
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.put('/:contactId', async (req, res, next) => {
  const { error } = validateContact(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { contactId } = req.params;
  const { name, email, phone } = req.body;

  try {
    const updatedContact = await contactsController.updateContact(contactId, { name, email, phone });
    if (updatedContact) {
      res.status(200).json(updatedContact);
    } else {
      res.status(404).json({ message: 'Не знайдено' });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
