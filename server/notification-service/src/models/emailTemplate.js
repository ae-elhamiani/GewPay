const mongoose = require('mongoose');

const emailTemplateSchema = new mongoose.Schema({
  category: String,
  name: String,
  subject: String,
  content: String,
  defaultTemplate: Boolean,
  version: Number
});

module.exports = mongoose.model('EmailTemplate', emailTemplateSchema);