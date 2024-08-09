// src/hooks/auth/useEmail.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../ProfileProvider';
import { authService } from '../../services/authService';

const useEmail = () => {
  const { email, setEmail } = useProfile();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await authService.sendEmailOTP(email);
      if (response.data.success) {
        setMessage('Verification code sent. Please check your email.');
        navigate('/verify-email-otp');
      } else {
        setMessage(response.data.message || 'Failed to send verification code. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    message,
    isLoading,
    handleSendOTP,
  };
};

export default useEmail;