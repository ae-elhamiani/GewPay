const PaymentSession = require('../models/PaymentSession');

// Service method to create a new order
const createOrder = async (orderData) => {
  try {
    const newOrder = new PaymentSession(orderData);
    return await newOrder.save();
  } catch (error) {
    throw new Error('Error creating order: ' + error.message);
  }
};

// Service method to find a session by orderId
const findSessionByOrderId = async (orderId) => {
  try {
    const paymentSession = await PaymentSession.findOne({ orderId });
    if (!paymentSession) {
      throw new Error('Payment session not found');
    }
    return paymentSession;
  } catch (error) {
    console.error('Error retrieving payment session:', error);
    throw error;
  }
};

// Export the service methods
module.exports = {
  createOrder,
  findSessionByOrderId,
};
