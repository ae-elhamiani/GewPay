const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const PaymentOrderSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  customId: {
    type: String,
    default: uuidv4,
  },
  merchantId: {
    type: String,
    required: true,
  },
  storeId: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'PENDING',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  items: [{
    name: String,
    quantity: Number,
    price: Number,
  }],
});

const PaymentOrder = mongoose.model('PaymentOrder', PaymentOrderSchema);
module.exports = PaymentOrder;