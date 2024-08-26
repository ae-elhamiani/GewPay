const { gql } = require('apollo-server');

const typeDefs = gql`
  enum PaymentStatus {
    PENDING
    COMPLETED
    FAILED
    ON_HOLD
    CANCELED
    REFUNDED
  }

  type Item {
    name: String!
    quantity: Int!
    price: Float!
  }

  type PaymentSession {
    sessionId: ID!
    merchantId: String!
    storeId: String!
    orderId: String!
    amount: Float!
    currency: String!
    status: PaymentStatus!
    customerEmail: String!
    items: [Item!]!
    paymentMethod: String
    paymentAddress: String
    storeLink: String
    expiresAt: String
    createdAt: String!
  }

  input ItemInput {
    name: String!
    quantity: Int!
    price: Float!
  }

  input CreatePaymentSessionInput {
    merchantId: String!
    storeId: String!
    orderId: String!
    amount: Float!
    currency: String!
    customerEmail: String!
    items: [ItemInput!]!
  }

  type Mutation {
    createPaymentSession(input: CreatePaymentSessionInput!): PaymentSession!
    updatePaymentDetails(sessionId: ID!, paymentMethod: String!, paymentAddress: String!): PaymentSession
    completePayment(sessionId: ID!): PaymentSession
  }

  type Query {
    getPaymentSession(sessionId: ID!): PaymentSession
    getAllPaymentSessions: [PaymentSession!]!
  }
`;

module.exports = typeDefs;
