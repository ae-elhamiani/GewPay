import React, { useState } from 'react';
import axios from 'axios';
import { useQuery } from '@apollo/client';
import { GET_PAYMENT_SESSION } from '../graphql/queries';

const OrderStatus = ({ session }) => {
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');

  // Fetch payment session data
  const { loading, error, data } = useQuery(GET_PAYMENT_SESSION, {
    variables: { session },
  });

  const updateOrderStatus = async (orderId, status, storeLink) => {
    try {
      console.log('Processing payment...');
      setStatus('processing');
      setMessage('Processing payment...');

      const response = await axios.post(
        `${storeLink}?update_order_status=1`,
        {
          order_id: orderId,
          status: status,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (response.data.success) {
        console.log(`Payment successful! Order status updated to '${status}'.`);
        setStatus('success');
        setMessage(`Payment successful! Order status updated to '${status}'.`);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error(`Payment failed: ${error.message}`);
      setStatus('error');
      setMessage(`Payment failed: ${error.message}`);
    }
  };



  //the functions that should be calles to update the order sataus on woocom

//   const handleButtonClick = () => {
//     if (data && data.getPaymentSession) {
//       const { orderId, storeLink } = data.getPaymentSession;
//       const newStatus = 'on-hold'; // Replace with desired status
//       updateOrderStatus(orderId, newStatus, storeLink);
//     }
//   };

// woocommeerce statuses 

// pending
// processing
// on-hold
// completed
// cancelled
// failed



//  local test only
const handleButtonClick = () => {
    // Hardcoded values for testing
    const orderId = 62;
    const storeLink = 'http://localhost:8080';
    const newStatus = 'on-hold'; // Replace with desired status

    updateOrderStatus(orderId, newStatus, storeLink);
  };

  if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error fetching payment session: {error.message}</p>;

  return (
    <div>
      <button onClick={handleButtonClick} disabled={status === 'processing'}>
        chnage status
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default OrderStatus;
