const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    _id: {
      type: String, // Using the wallet address as the _id
      required: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
      default: '', 
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
      default: '', 
    },
    pack: {
      type: String,
      enum: ['basic', 'premium'],
      default: 'basic',
      required: true,
    },
    emailOtpHash: {
      type: String,
      trim: true,
    },
    emailOtpSentAt: {
      type: Date,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailotpAttempts: { 
      type: Number,
      default: 0
     },
    phoneOtpHash: {
      type: String,
      trim: true,
    },
    phoneOtpSentAt: {
      type: Date,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    photo: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
