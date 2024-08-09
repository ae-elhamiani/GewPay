// src/hooks/ProfileProvider.jsx
import React, { createContext, useContext, useState } from 'react';

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [name, setName] = useState('');
  const [businessActivity, setBusinessActivity] = useState('');
  const [email, setEmail] = useState('');
  const [showCardData, setShowCardData] = useState(true);

  const value = {
    uploadedImage,
    setUploadedImage,
    name,
    setName,
    businessActivity,
    setBusinessActivity,
    email,
    setEmail,
    showCardData,
    setShowCardData,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};