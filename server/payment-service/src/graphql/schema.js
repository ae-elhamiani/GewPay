const { gql } = require('apollo-server');

const typeDefs = gql`
  type Item {
    name: String!
    quantity: Int!
    price: Float!
  }

  type PaymentOrder {
    id: ID!
    customId: String!
    merchantId: String!
    storeId: String!
    orderId: String!
    amount: Float!
    currency: String!
    status: String!
    createdAt: String!
    expiresAt: String!
    customerEmail: String!
    items: [Item!]!
  }

  input ItemInput {
    name: String!
    quantity: Int!
    price: Float!
  }

  input CreatePaymentOrderInput {
    merchantId: String!
    storeId: String!
    orderId: String!
    amount: Float!
    currency: String!
    customerEmail: String!
    expiresAt: String!
    items: [ItemInput!]!
  }

  type Query {
    paymentOrder(customId: String!): PaymentOrder
    paymentOrders: [PaymentOrder!]!
  }

  type Mutation {
    createPaymentOrder(input: CreatePaymentOrderInput!): PaymentOrder
  }
`;

module.exports = typeDefs;