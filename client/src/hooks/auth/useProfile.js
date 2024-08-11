import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileContext } from '../ProfileProvider';
import {authService} from '../../services/authService';

export const useProfile = () => {
  const {
    uploadedImage, setUploadedImage,
    name, setName,
    businessActivity, setBusinessActivity
  } = useProfileContext();

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

  const sendProfileData = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      if (response.data.step) {
        localStorage.setItem('registrationStep', response.data.step);
        navigate('/register-email');
      } else {
        setMessage('Profile updated successfully.');
      }
    } catch (error) {
      console.error('Error sending profile data:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const address = localStorage.getItem('address');
      if (!address) {
        throw new Error('Wallet address not found');
      }

      const profileData = {
        username: name,
        businessActivity,
        address: address.toLowerCase(),
      };

      if (uploadedImage) {
        profileData.image = uploadedImage;
      }

      await sendProfileData(profileData);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    message,
    isLoading,
    handleImageUpload,
    handleSubmit,
  };
};