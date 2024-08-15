// File: src/graphql/schema.js

const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type PaymentOrder {
    id: ID!
    amount: Float!
    currency: String!
    status: PaymentStatus!
    createdAt: String!
    updatedAt: String!
  }

  enum PaymentStatus {
    PENDING
    PROCESSING
    COMPLETED
    FAILED
  }

  input CreatePaymentOrderInput {
    amount: Float!
    currency: String!
  }

  type PaymentError {
    message: String!
    code: String!
  }

  union PaymentResult = PaymentOrder | PaymentError

  type Query {
    getPaymentOrder(id: ID!): PaymentOrder
    getPaymentOrders(status: PaymentStatus): [PaymentOrder!]!
  }

  type Mutation {
    createPaymentOrder(input: CreatePaymentOrderInput!): PaymentResult!
    updatePaymentStatus(id: ID!, status: PaymentStatus!): PaymentResult!
  }
  
  type WooCommerceOrder {
    id: ID!
    status: String!
    currency: String!
    total: String!
    billing: BillingInfo
    shipping: ShippingInfo
  }

  type BillingInfo {
    first_name: String!
    last_name: String!
    address_1: String!
    city: String!
    state: String!
    postcode: String!
    country: String!
    email: String!
    phone: String
  }

  type ShippingInfo {
    first_name: String!
    last_name: String!
    address_1: String!
    city: String!
    state: String!
    postcode: String!
    country: String!
  }

  extend type Query {
    getWooCommerceOrder(orderId: ID!): WooCommerceOrder
  }
`;

module.exports = typeDefs;
