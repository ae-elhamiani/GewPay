// src/hooks/usePhoneOTP.js
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const usePhoneOTP = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone || '';

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setMessage("Please enter the complete OTP.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/phone/verify-phone-otp', { phone, otp });
      setMessage(response.data.message);
      if (response.data.success) {
        toast.success('OTP verified successfully! Redirecting to profile...', {
          position: toast.POSITION.TOP_CENTER
        });
        setTimeout(() => navigate('/profile'), 3000);
      } else {
        setMessage('Invalid OTP. Please try again.');
        toast.error('Invalid OTP. Please try again.', {
          position: toast.POSITION.TOP_CENTER
        });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setMessage('Failed to verify OTP. Please try again.');
      toast.error('Failed to verify OTP. Please try again.', {
        position: toast.POSITION.TOP_CENTER
      });
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
  };
};

export default usePhoneOTP;
