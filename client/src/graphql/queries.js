// src/graphql/paymentQueries.js
import { gql } from '@apollo/client';

export const GET_PAYMENT_SESSION = gql`
  query GetPaymentSession($sessionId: ID!) {
    getPaymentSession(sessionId: $sessionId) {
      sessionId
      merchantId
      storeId
      orderId
      amount
      currency
      status
      customerEmail
      items {
        name
        quantity
        price
      }
      storeLink           
      paymentMethod
      paymentAddress
      expiresAt
      createdAt
    }
  }
`;

export const UPDATE_PAYMENT_DETAILS = gql`
  mutation UpdatePaymentDetails($sessionId: ID!, $paymentMethod: String!, $paymentAddress: String!) {
    updatePaymentDetails(sessionId: $sessionId, paymentMethod: $paymentMethod, paymentAddress: $paymentAddress) {
      sessionId
      status
      storeLink            
      paymentMethod
      paymentAddress
    }
  }
`;

export const COMPLETE_PAYMENT = gql`
  mutation CompletePayment($sessionId: ID!) {
    completePayment(sessionId: $sessionId) {
      sessionId
      status
      storeLink 
    } 
  }
`;
