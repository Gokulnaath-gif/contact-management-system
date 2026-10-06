const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const ContactSchema = new mongoose.Schema(
  {
    contactId: { type: String, unique: true, trim: true, default: () => randomUUID() },
    name: { type: String, required: [true, 'Name is required'], trim: true },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
      match: [/^\d{10}$/, 'Phone must be exactly 10 digits'],
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', ContactSchema);