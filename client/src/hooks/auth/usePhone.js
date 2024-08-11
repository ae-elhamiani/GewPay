import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileContext } from '../ProfileProvider';
import { authService } from '../../services/authService';

const usePhone = () => {
  const { phone } = useProfileContext();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!phone) {
      setMessage('Please enter a valid phone number.');
      return;
    }
    setIsLoading(true);
    setMessage('');

    try {
      const address = localStorage.getItem('address');
      if (!address) {
        throw new Error('Wallet address not found');
      }

      const response = await authService.addPhone({ phone, address });
      if (response.data.step) {
        localStorage.setItem('registrationStep', response.data.step);
        setMessage('Verification code sent. Please check your phone.');
        setTimeout(() => navigate('/verify-phone-otp'), 2000);
      } else {
        setMessage('Failed to send verification code. Please try again.');
      }
    } catch (error) {
      console.error('Error registering phone:', error);
      setMessage('An error occurred. Please try again.');
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

export default usePhone;