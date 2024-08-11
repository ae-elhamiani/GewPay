// src/hooks/ProfileProvider.jsx
import React, { createContext, useContext, useState } from 'react';

const ProfileContext = createContext();

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [name, setName] = useState('');
  const [businessActivity, setBusinessActivity] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showCardData, setShowCardData] = useState(true);

  const value = {
    uploadedImage,
    setUploadedImage,
    name,
    setName,
    businessActivity,
    setBusinessActivity,
    phone,
    setPhone,
    email,
    setEmail,
    showCardData,
    setShowCardData,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};