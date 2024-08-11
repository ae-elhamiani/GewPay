import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileContext } from '../ProfileProvider';
import { authService } from '../../services/authService';

const usePhoneOTP = () => {
  const { phone } = useProfileContext();
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const address = localStorage.getItem('address');
      if (!address) {
        throw new Error('Wallet address not found');
      }

      const response = await authService.verifyPhoneOTP({ otp, address });
      localStorage.setItem('registrationStep', response.data.step);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setMessage('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const address = localStorage.getItem('address');
      if (!address) {
        throw new Error('Wallet address not found');
      }

      await authService.addPhone({ phone, address });
      setMessage('Verification code resent. Please check your phone.');
      setResendCountdown(60);
    } catch (error) {
      console.error('Error resending OTP:', error);
      setMessage('Failed to resend verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    otp,
    setOtp,
    message,
    isLoading,
    phone,
    handleVerifyOTP,
    resendCode,
    resendCountdown
  };
};

export default usePhoneOTP;