// src/components/PaymentMethod.js
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_PAYMENT_DETAILS } from '../../graphql/queries';

const PaymentMethod = ({ session }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [updatePaymentDetails] = useMutation(UPDATE_PAYMENT_DETAILS);

  const handlePaymentMethodSelect = async (method) => {
    setPaymentMethod(method);
    try {
      const { data } = await updatePaymentDetails({
        variables: {
          sessionId: session.sessionId,
          paymentMethod: method,
          paymentAddress: 'Generated Address', // This should be generated on the server
        },
      });
      console.log('Payment details updated:', data);
    } catch (error) {
      console.error('Error updating payment details:', error);
    }
  };

  return (
    <div>
      <h2>Select Payment Method</h2>
      <button onClick={() => handlePaymentMethodSelect('BTC')}>Bitcoin</button>
      <button onClick={() => handlePaymentMethodSelect('ETH')}>Ethereum</button>
      {/* Add more payment methods as needed */}
      {paymentMethod && (
        <div>
          <h3>Selected Method: {paymentMethod}</h3>
          <p>Send payment to: {session.paymentAddress}</p>
        </div>
      )}
    </div>
  );
};

export default PaymentMethod;