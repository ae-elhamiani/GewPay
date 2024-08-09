// src/hooks/auth/useEmail.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const useEmail = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e, email) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Replace this with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessage('Verification code sent. Please check your email.');
      navigate('/verify-email-otp');
    } catch (error) {
      console.error('Error sending OTP:', error);
      setMessage('Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    message,
    isLoading,
    handleSendOTP,
  };
};

export default useEmail;