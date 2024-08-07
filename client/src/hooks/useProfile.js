import { useState, useEffect } from 'react';
import axios from 'axios';
import { createAvatar } from '@dicebear/core';
import { identicon } from '@dicebear/collection';
import { useNavigate, useLocation } from 'react-router-dom';

export const useProfile = () => {
  const [avatarSvg, setAvatarSvg] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showWaves, setShowWaves] = useState(false);
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const seed = Math.random().toString(36).substring(7);
    const avatar = createAvatar(identicon, {
      seed: seed,
      size: 64,
      backgroundColor: ['#04B5D3'], // Your desired color
    });
    console.log('Generated SVG String:', avatar.toString()); // Log the SVG string
    setAvatarSvg(avatar.toString());
  }, []);

  useEffect(() => {
    console.log('Location state:', location.state); // Debugging log
    if (location.state?.walletAddress) {
      setWalletAddress(location.state.walletAddress);
      console.log('Wallet Address set:', location.state.walletAddress);
    }
    if (location.state?.email) {
      setEmail(location.state.email);
      console.log('Email set:', location.state.email);
    }
  }, [location.state]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setUploadedImage(reader.result);
      setShowWaves(true);

      setTimeout(() => {
        setShowWaves(false);
      }, 2000);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('country', country);
    formData.append('walletAddress', walletAddress);
    formData.append('email', email);

    const fileInput = document.getElementById('photo');
    if (fileInput.files.length > 0) {
      formData.append('photo', fileInput.files[0]);
      console.log('Appended file:', fileInput.files[0]);
    } else {
      console.log('No file selected');
    }

    try {
      console.log('Sending form data:', formData);
      const response = await axios.post('http://localhost:5001/profile/save-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Server response:', response.data);
      setMessage(response.data.message);
      if (response.data.success) {
        console.log('Navigation to /register-email with walletAddress:', walletAddress);
        navigate('/register-email', { state: { walletAddress, email } });
      } else {
        console.log('Server response did not indicate success');
      }
    } catch (error) {
      console.error('Error saving profile data:', error);
      setMessage('Failed to save profile data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    avatarSvg,
    uploadedImage,
    showWaves,
    name,
    setName,
    country,
    setCountry,
    message,
    setMessage,
    isLoading,
    setIsLoading,
    handleImageUpload,
    handleSubmit,
    walletAddress,
    email
  };
};
