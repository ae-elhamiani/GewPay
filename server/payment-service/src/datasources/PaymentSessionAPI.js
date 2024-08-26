// Rename this file to PaymentSessionAPI.js
const { DataSource } = require('apollo-datasource');
const PaymentSession = require('../models/PaymentSession');

class PaymentSessionAPI extends DataSource {
  constructor() {
    super();
  }

  initialize(config) {
    this.context = config.context;
  }

  async getPaymentSessionBySessionId(sessionId) {
    return await PaymentSession.findOne({ sessionId });
  }

  async getAllPaymentSessions() {
    return await PaymentSession.find();
  }

  async createPaymentSession(sessionData) {
    const session = new PaymentSession(sessionData);
    return await session.save();
  }
}

module.exports = PaymentSessionAPI;
