// services/paymentSessionService.js
const PaymentOrder = require('../models/PaymentSession');

class PaymentSessionService {
  async createSession(orderData) {
    const order = new PaymentOrder({
      ...orderData,
      expiresAt: new Date(Date.now() + 30 * 60000), // 30 minutes from now
    });
    await order.save();
    return order.sessionId; // Use this as the session ID
  }

  async getSession(sessionId) {
    const order = await PaymentOrder.findOne({ sessionId });
    if (!order) throw new Error('Session not found');
    return order;
  }
  
  async findSessionByOrderId(orderId) {
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
}

  async updatePaymentDetails(sessionId, paymentMethod, paymentAddress) {
    const order = await PaymentOrder.findOneAndUpdate(
      { sessionId },
      { paymentMethod, paymentAddress, status: 'PROCESSING' },
      { new: true }
    );
    if (!order) throw new Error('Session not found');
    return order;
  }

  async completePayment(sessionId) {
    const order = await PaymentOrder.findOneAndUpdate(
      { sessionId },
      { status: 'COMPLETED' },
      { new: true }
    );
    if (!order) throw new Error('Session not found');
    return order;
  }
}

module.exports = new PaymentSessionService();