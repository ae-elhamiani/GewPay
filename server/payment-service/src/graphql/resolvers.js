const PaymentOrder = require('../models/PaymentOrder');

const resolvers = {
  Query: {
    paymentOrder: (_, { customId }, { dataSources }) => 
      dataSources.paymentOrderAPI.getPaymentOrderByCustomId(customId),
    paymentOrders: (_, __, { dataSources }) => 
      dataSources.paymentOrderAPI.getAllPaymentOrders(),
  },
  Mutation: {
    createPaymentOrder: async (_, { input }) => {
      const newOrder = new PaymentOrder(input);
      await newOrder.save();
      return newOrder;
    },
  },
};

module.exports = resolvers;