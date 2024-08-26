// src/components/PaymentStatus.js
import React from 'react';
import { useMutation } from '@apollo/client';
import { COMPLETE_PAYMENT } from '../../graphql/queries';

const PaymentStatus = ({ session }) => {
  const [completePayment] = useMutation(COMPLETE_PAYMENT);

  const handleCompletePayment = async () => {
    try {
      const { data } = await completePayment({
        variables: { sessionId: session.sessionId },
      });
      console.log('Payment completed:', data);
    } catch (error) {
      console.error('Error completing payment:', error);
    }
  };

  return (
    <div>
      <h2>Payment Status</h2>
      <p>Current Status: {session.status}</p>
      {session.status === 'PROCESSING' && (
        <button onClick={handleCompletePayment}>Complete Payment</button>
      )}
      {session.status === 'COMPLETED' && (
        <p>Thank you for your payment!</p>
      )}
    </div>
  );
};

export default PaymentStatus;