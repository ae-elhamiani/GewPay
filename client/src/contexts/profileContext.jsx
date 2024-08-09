import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { createAvatar } from '@dicebear/core';
import { identicon } from '@dicebear/collection';
import { useNavigate, useLocation } from 'react-router-dom';

const ProfileContext = createContext();

export const useProfile = () => {
  return useContext(ProfileContext);
};

export const ProfileProvider = ({ children }) => {
  const [avatarSvg, setAvatarSvg] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showWaves, setShowWaves] = useState(false);
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCardData, setShowCardData] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const walletAddress = location.state?.walletAddress || '';

  useEffect(() => {
    const seed = Math.random().toString(36).substring(7);
    const avatar = createAvatar(identicon, {
      seed: seed,
      size: 64,
      backgroundColor: ['#04B5D3'],
    });
    // setAvatarSvg(avatar.toDataUriSync());
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setUploadedImage(reader.result);
      setShowCardData(true);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };


  // the working  handlesubmit with endpoint
  
  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   setIsLoading(true);
  //   const formData = new FormData();
  //   formData.append('name', name);
  //   formData.append('country', country);
  //   formData.append('walletAddress', walletAddress);

  //   const fileInput = document.getElementById('photo');
  //   if (fileInput.files.length > 0) {
  //     formData.append('photo', fileInput.files[0]);
  //   }

  //   try {
  //     const response = await axios.post('http://localhost:5001/profile/save-profile', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     });
  //     setMessage(response.data.message);
  //     if (response.data.success) {
  //       navigate('/register-email', { state: { walletAddress } });
  //     }
  //   } catch (error) {
  //     setMessage('Failed to save profile data. Please try again.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  


// handleSubmit  for  only navigation test     

const handleSubmit = async (event) => {
  event.preventDefault();
  setIsLoading(true);
  const formData = new FormData();
  formData.append('name', name);
  formData.append('country', country);
  formData.append('walletAddress', walletAddress);

  const fileInput = document.getElementById('photo');
  if (fileInput && fileInput.files.length > 0) {
    formData.append('photo', fileInput.files[0]);
  }

  try {
    // Simulating a backend call
    console.log('Would send form data:', formData);
    setMessage('Profile data saved successfully (simulated).');
    navigate('/register-email')
    // We're not actually sending data to a backend for now
  } catch (error) {
    console.error('Error saving profile data:', error);
    setMessage('Failed to save profile data. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  const handleSendEmailOTP = async () => {
    setIsLoading(true);
    setMessage('');

    const validateEmail = (email) => {
      const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return re.test(String(email).toLowerCase());
    };

    if (!validateEmail(email)) {
      setMessage('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/email/register-email', {
        email,
        walletAddress,
      });

      if (response.data.success) {
        setMessage('Verification code sent. Please check your email.');
        navigate('/verify-email-otp', { state: { email, walletAddress } });
      } else {
        setMessage(response.data.message || 'Failed to send verification code. Please try again.');
      }
    } catch (error) {
      setMessage('Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  
  return (
    <ProfileContext.Provider
      value={{
        avatarSvg,
        uploadedImage,
        showWaves,
        name,
        setName,
        country,
        setCountry,
        email,
        setEmail,
        phoneNumber,
        setPhoneNumber,
        message,
        isLoading,
        handleImageUpload,
        handleSubmit,
        handleSendEmailOTP,
        showCardData,
        setShowCardData,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
