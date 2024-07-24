const mongoose = require('mongoose');

const merchantSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true
  },
  isRegistered: {
    type: Boolean,
    default: false
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  profileCompleted: {
    type: Boolean,
    default: false
  },
  name: String,
  email: String,
  phone: String
}, { timestamps: true });

module.exports = mongoose.model('Merchant', merchantSchema);