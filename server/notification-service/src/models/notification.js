const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  email: String,
  templateName: String,
  exception: { type: String, default: '' },
  createdDate: { type: Date, default: Date.now },
  sent: Boolean
});

module.exports = mongoose.model('Notification', notificationSchema);