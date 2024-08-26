import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_PAYMENT_SESSION } from '../../graphql/mutations';

const CurrencySelectionPage = ({ order }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [createPaymentSession] = useMutation(CREATE_PAYMENT_SESSION);

  const handleCurrencySelect = async () => {
    try {
      const { data } = await createPaymentSession({
        variables: {
          input: {
            orderId: order.orderId,
            currency: selectedCurrency,
          },
        },
      });
      // Handle successful payment session creation (e.g., redirect to payment details page)
      console.log('Payment session created:', data.createPaymentSession);
    } catch (error) {
      console.error('Error creating payment session:', error);
    }
  };

  return (
    <div>
      <h2>Select Payment Currency</h2>
      <p>Order Total: {order.amount} {order.currency}</p>
      <select onChange={(e) => setSelectedCurrency(e.target.value)}>
        <option value="">Select a currency</option>
        <option value="BTC">Bitcoin (BTC)</option>
        <option value="ETH">Ethereum (ETH)</option>
        {/* Add more currency options as needed */}
      </select>
      <button onClick={handleCurrencySelect} disabled={!selectedCurrency}>
        Continue to Payment
      </button>
    </div>
  );
};

export default CurrencySelectionPage;