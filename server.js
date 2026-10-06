require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/contact_management';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/contacts', contactRoutes);

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Invalid JSON body' });
  }
  next(err);
});

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

mongoose
  .connect(MONGODB_URI, { dbName: 'contact_management' })
  .then(() => {
    console.log('MongoDB connected (database: contact_management)');
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });