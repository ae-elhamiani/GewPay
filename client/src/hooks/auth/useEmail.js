import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProfile } from '../../contexts/profileContext';

const useEmail = () => {
  const { email, setEmail } = useProfile();
  const [message, setLocalMessage] = useState('');
  const [isLoading, setLocalIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const walletAddress = location.state?.walletAddress;

  useEffect(() => {
    if (!walletAddress) {
      navigate('/'); // Redirect to home if wallet address is not available
    }
  }, [walletAddress, navigate]);

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLocalIsLoading(true);
    setLocalMessage('');

    if (!validateEmail(email)) {
      setLocalMessage('Please enter a valid email address.');
      setLocalIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/email/register-email', {
        email,
        walletAddress,
      });

      if (response.data.success) {
        setLocalMessage('Verification code sent. Please check your email.');
        // setMessage('Verification code sent. Please check your email.'); // Update context message
        navigate('/verify-email-otp', { state: { email, walletAddress } });
      } else {
        setLocalMessage(response.data.message || 'Failed to send verification code. Please try again.');
        // setMessage(response.data.message || 'Failed to send verification code. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        setLocalMessage(error.response.data.message || 'An error occurred. Please try again.');
        // setMessage(error.response.data.message || 'An error occurred. Please try again.');
      } else if (error.request) {
        setLocalMessage('No response from server. Please check your connection and try again.');
        // setMessage('No response from server. Please check your connection and try again.');
      } else {
        setLocalMessage('An error occurred. Please try again.');
        // setMessage('An error occurred. Please try again.');
      }
    } finally {
      setLocalIsLoading(false);
      // setIsLoading(false); // Update context loading state
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
