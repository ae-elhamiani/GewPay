import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const useEmail = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (email) => {
    setIsLoading(true);
    setMessage('');

    try {
      const address = localStorage.getItem('address');
      if (!address) {
        throw new Error('Wallet address not found');
      }

      const response = await authService.addEmail({ email, address });
      setMessage('Verification code sent. Please check your email.');
      localStorage.setItem('registrationStep', response.data.step);
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