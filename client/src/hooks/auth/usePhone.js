// src/hooks/usePhoneRegistration.js
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const usePhone = () => {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const walletAddress = location.state?.walletAddress || '';

  const handleRegisterPhone = async (e) => {
    e.preventDefault();
    if (!phone) {
      setMessage('Please enter a valid phone number.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/phone/register-phone', { phone, walletAddress });
      setMessage(response.data.message);
      if (response.data.success) {
        setTimeout(() => navigate('/verify-phone-otp', { state: { phone, walletAddress } }), 2000);
      }
    } catch (error) {
      console.error('Error registering phone:', error);
      setMessage('Failed to register phone. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    phone,
    setPhone,
    message,
    isLoading,
    handleRegisterPhone,
  };
};

export default usePhone;
