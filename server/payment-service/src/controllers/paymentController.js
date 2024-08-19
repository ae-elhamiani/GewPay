const paymentService = require('../services/PaymentService');
const logger = require('../utils/logger');

exports.createPayment = async (req, res) => {
  try {
    const paymentData = req.body;
    const result = await paymentService.createPayment(paymentData);
    res.json(result);
  } catch (error) {
    logger.error('Error creating payment:', error);
    res.status(500).json({ success: false, message: 'Error creating payment' });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId, status } = req.body;
    const result = await paymentService.updatePaymentStatus(paymentId, status);
    res.json(result);
  } catch (error) {
    logger.error('Error updating payment status:', error);
    res.status(500).json({ success: false, message: 'Error updating payment status' });
  }
};