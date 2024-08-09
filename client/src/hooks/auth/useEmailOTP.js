// src/hooks/useEmailOTP.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const useEmailOTP = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const walletAddress = location.state?.walletAddress || '';

  useEffect(() => {
    if (!email || !walletAddress) {
      console.log('Missing email or wallet address, redirecting to home');
      // navigate('/');
    }
  }, [email, walletAddress, navigate]);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setMessage("Please enter the complete OTP.");
      setIsSuccess(false);
      return;
    }
    setIsLoading(true);
    console.log('Sending OTP verification request:', { email, otp });
    try {
      const response = await axios.post('http://localhost:5001/email/verify-email-otp', { email, otp });
      console.log('Server response:', response.data);
      setMessage(response.data.message);
      if (response.data.success) {
        setIsSuccess(true);
        setTimeout(() => navigate('/profile', { state: { walletAddress } }), 2000);
      } else {
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error.response?.data || error);
      setMessage(error.response?.data?.message || 'Failed to verify OTP. Please check the code and try again.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    otp,
    setOtp,
    message,
    isSuccess,
    isLoading,
    email,
    handleVerifyOTP,
  };
};

export default useEmailOTP;
