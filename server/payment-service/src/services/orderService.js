// services/orderService.js
const PaymentOrder = require('../models/PaymentOrder');

const createOrder = async (orderData) => {
  try {
    const newOrder = new PaymentOrder(orderData);
    return await newOrder.save();
  } catch (error) {
    throw new Error('Error creating order: ' + error.message);
  }
};

// You can add other order-related business logic here as needed
module.exports = {
  createOrder,
};
