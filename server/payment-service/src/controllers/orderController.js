// controllers/orderController.js
const orderService = require('../services/orderService');

const createOrder = async (req, res) => {
  try {
    const orderData = req.body; // Extract order data from request body
    const newOrder = await orderService.createOrder(orderData); // Delegate to service
    res.status(201).json({ success: true, sessionId: newOrder.sessionId, message: 'Order saved successfully' });
  } catch (error) {
    console.error('Error in createOrder:', error.message);
    res.status(500).json({ success: false, message: 'Error saving order: ' + error.message });
  }
};

const getSessionId = async (req, res) => {
  try {
    const { orderId } = req.body; // Extract orderId from request body
    const session = await orderService.findSessionByOrderId(orderId); // Delegate to service
    res.status(200).json({ success: true, sessionId: session.sessionId });
  } catch (error) {
    if (error.message === 'Payment session not found') {
      res.status(404).json({ success: false, message: error.message });
    } else {
      console.error('Error in getSessionId:', error.message);
      res.status(500).json({ success: false, message: 'Error retrieving session: ' + error.message });
    }
  }
};

// Export the controller methods
module.exports = {
  createOrder,
  getSessionId,
};
