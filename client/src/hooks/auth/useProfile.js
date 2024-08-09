// src/hooks/auth/useProfile.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../ProfileProvider';
import { authService } from '../../services/authService';

export const useProfile = () => {
  const { 
    uploadedImage, setUploadedImage, 
    name, setName, 
    businessActivity, setBusinessActivity 
  } = useProfile();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setUploadedImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');

    const merchantId = localStorage.getItem('merchantId');
    if (!merchantId) {
      setMessage('Merchant ID not found. Please reconnect your wallet.');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('username', name);
    formData.append('businessActivity', businessActivity);
    formData.append('merchantId', merchantId);

    if (uploadedImage) {
      formData.append('image', uploadedImage);
    }

    try {
      const response = await authService.updateProfile(formData);
      if (response.data.step) {
        localStorage.setItem('registrationStep', response.data.step);
        navigate('/register-email', { state: { walletAddress: merchantId } });
      } else {
        setMessage('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uploadedImage,
    name,
    setName,
    businessActivity,
    setBusinessActivity,
    message,
    isLoading,
    handleImageUpload,
    handleSubmit,
  };
};
