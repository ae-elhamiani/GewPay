const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const PaymentSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    default: uuidv4,
    unique: true,
    required: true
  },
  merchantId: String,
  storeId: String,
  orderId: String,
  amount: Number,
  currency: String,
  status: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'ON_HOLD', 'CANCELLED'],
    default: 'PENDING'
  },
  customerEmail: String,
  items: [{
    name: String,
    quantity: Number,
    price: Number
  }],
  storeLink: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    default: () => Date.now() + 15 * 60 * 1000 // 15 minutes from now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const PaymentSession = mongoose.model('PaymentSession', PaymentSessionSchema);
module.exports = PaymentSession;