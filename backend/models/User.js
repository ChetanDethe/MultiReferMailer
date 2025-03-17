const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  appPassword: { type: String, required: true },
  emailTemplate: {
    subject: { type: String, default: '' },
    body: { type: String, default: '' },
  },
  cv: { type: String, default: '' }, // Store CV path or URL
});

module.exports = mongoose.model('User', userSchema);