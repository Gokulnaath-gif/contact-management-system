const express = require('express');
const Contact = require('../models/Contact');
const router = express.Router();

function handleError(err, res) {
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return res.status(409).json({ success: false, message: `Duplicate value: ${field} already exists` });
  }
  console.error(err);
  return res.status(500).json({ success: false, message: 'Server error' });
}

router.post('/', async (req, res) => {
  try {
    const { contactId, name, phone, email } = req.body;
    const contact = await Contact.create({ contactId, name, phone, email: email || undefined });
    res.status(201).json({ success: true, data: contact });
  } catch (err) { handleError(err, res); }
});

router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, count: contacts.length, data: contacts });
  } catch (err) { handleError(err, res); }
});

router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findOne({ contactId: req.params.id });
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.json({ success: true, data: contact });
  } catch (err) { handleError(err, res); }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (phone !== undefined) update.phone = phone;
    if (email) update.email = email;
    const ops = { $set: update };
    if (email === '' || email === null) ops.$unset = { email: 1 };

    const contact = await Contact.findOneAndUpdate(
      { contactId: req.params.id }, ops, { new: true, runValidators: true }
    );
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.json({ success: true, data: contact });
  } catch (err) { handleError(err, res); }
});

router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({ contactId: req.params.id });
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.json({ success: true, message: 'Contact deleted', data: contact });
  } catch (err) { handleError(err, res); }
});

module.exports = router;