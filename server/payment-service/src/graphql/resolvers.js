const { ForbiddenError } = require('apollo-server-express');
const PaymentOrder = require('../models/PaymentOrder');
 const wooCommerceService = require('../services/wooCommerceService');

const {
  PaymentNotFoundError,
  InsufficientFundsError,
  InvalidCurrencyError,
} = require('../middlleware/customErrors');

const resolvers = {
  Query: {
    getPaymentOrder: async (_, { id }, context) => {
      if (!context.user) throw new AuthenticationError('You must be logged in');
      if (context.user.role !== 'ADMIN' && context.user.id !== id) {
        throw new ForbiddenError('You can only access your own payment orders');
      }

      const order = await PaymentOrder.findById(id);
      if (!order) throw new PaymentNotFoundError(id);
      return order;
    },

    getPaymentOrders: async (_, { status }, context) => {
      if (!context.user) throw new AuthenticationError('You must be logged in');
      if (context.user.role !== 'ADMIN') {
        throw new ForbiddenError('Only admins can view all payment orders');
      }
      const query = status ? { status } : {};
      return await PaymentOrder.find(query);
    },
    getWooCommerceOrder: async (_, { orderId }, context) => {
      if (!context.user) throw new AuthenticationError('You must be logged in');
      if (context.user.role !== 'ADMIN') {
        throw new ForbiddenError('Only admins can fetch WooCommerce orders');
      }

      try {
        const order = await wooCommerceService.getOrder(orderId);
        return {
          id: order.id,
          status: order.status,
          currency: order.currency,
          total: order.total,
          billing: order.billing,
          shipping: order.shipping,
        };
      } catch (error) {
        console.error('Error fetching WooCommerce order:', error);
        throw new Error('Failed to fetch WooCommerce order');
      }
    },
  },
  Mutation: {
    createPaymentOrder: async (_, { input }) => {
      const { amount, currency } = input;

      // Example validation
      if (!['USD', 'EUR', 'GBP'].includes(currency)) {
        throw new InvalidCurrencyError(currency);
      }

      // Here you might check for sufficient funds
      if (amount > 10000) {
        // Example threshold
        throw new InsufficientFundsError();
      }

      const newOrder = new PaymentOrder({
        ...input,
        status: 'PENDING',
      });
      return await newOrder.save();
    },
    updatePaymentStatus: async (_, { id, status }) => {
      const updatedOrder = await PaymentOrder.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true }
      );
      if (!updatedOrder) {
        throw new PaymentNotFoundError(id);
      }
      return updatedOrder;
    },
  },
};

module.exports = resolvers;
