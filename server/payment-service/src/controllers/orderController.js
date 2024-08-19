// controllers/orderController.js
const orderService = require('../services/orderService');

const createOrder = async (req, res) => {
  try {
    const orderData = req.body; // Extract order data from request body
    const newOrder = await orderService.createOrder(orderData); // Delegate to service
    res.status(201).json({ success: true, customId: newOrder.customId, message: 'Order saved successfully' });
  } catch (error) {
    console.error('Error in createOrder:', error.message);
    res.status(500).json({ success: false, message: 'Error saving order: ' + error.message });
  }
};

// You can add other controller methods for different operations here
module.exports = {
  createOrder,
};
