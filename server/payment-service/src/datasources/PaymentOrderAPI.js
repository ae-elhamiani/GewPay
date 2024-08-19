const { DataSource } = require('apollo-datasource');
const PaymentOrder = require('../models/PaymentOrder');

class PaymentOrderAPI extends DataSource {
  constructor() {
    super();
  }

  initialize(config) {
    this.context = config.context;
  }

  async getPaymentOrderByCustomId(customId) {
    return await PaymentOrder.findOne({ customId });
  }

  async getAllPaymentOrders() {
    return await PaymentOrder.find();
  }

  async createPaymentOrder(orderData) {
    const newOrder = new PaymentOrder(orderData);
    await newOrder.save();
    return newOrder;
  }
}

module.exports = PaymentOrderAPI;