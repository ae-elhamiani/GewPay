import { gql } from '@apollo/client';

export const CREATE_PAYMENT_SESSION = gql`
  mutation CreatePaymentSession($input: CreatePaymentSessionInput!) {
    createPaymentSession(input: $input) {
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
      expiresAt
      createdAt
    }
  }
`;
