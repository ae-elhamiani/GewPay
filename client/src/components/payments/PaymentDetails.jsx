// src/components/PaymentDetails.js
import React from 'react';

const PaymentDetails = ({ session }) => {
  return (
    <div>
      <h2>Order Details</h2>
      <p>Amount: {session.amount} {session.currency}</p>
      <p>Status: {session.status}</p>
      <h3>Items:</h3>
      <ul>
        {session.items.map((item, index) => (
          <li key={index}>
            {item.name} - Quantity: {item.quantity}, Price: {item.price}
          </li>
        ))}
      </ul>
      <p>Expires at: {new Date(session.expiresAt).toLocaleString()}</p>
    </div>
  );
};

export default PaymentDetails;