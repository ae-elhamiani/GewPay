const mongoose = require('mongoose');
const crypto = require('crypto');

const RegistrationStep = {
  INITIAL: 'INITIAL',
  EMAIL: 'EMAIL',
  VERIFY_EMAIL: 'VERIFY_EMAIL',
  PHONE: 'PHONE',
  VERIFY_PHONE: 'VERIFY_PHONE',
  COMPLETE: 'COMPLETE'
};

const merchantSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // This will be the Ethereum address
  secretKey: { type: String, default: () => crypto.randomBytes(32).toString('base64') },
  image: String,
  username: String,
  businessActivity: String,
  email: String,
  emailVerified: { type: Boolean, default: false },
  phone: String,
  phoneVerified: { type: Boolean, default: false },
  registrationStep: { type: String, enum: Object.values(RegistrationStep), default: RegistrationStep.INITIAL }
}, { timestamps: true });

module.exports = {
  Merchant: mongoose.model('Merchant', merchantSchema),
  RegistrationStep
};