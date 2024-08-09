import React from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useProfile } from '../../contexts/profileContext';
import { useNavigate } from 'react-router-dom';

function ProfileData() {
  const {
    avatarSvg,
    uploadedImage,
    name,
    setName,
    country,
    setCountry,
    message,
    isLoading,
    handleImageUpload: originalHandleImageUpload,
    walletAddress,
    email,
    handleSubmit: originalHandleSubmit,
    setShowCardData,
  } = useProfile();

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submitting profile data...");
    console.log("Wallet Address:", walletAddress);
    console.log("Email:", email);
    const success = await originalHandleSubmit(event);
    // if (success) {
      navigate('/register-email', { state: { walletAddress, email } });
    //  }
  };

  const handleImageUpload = (event) => {
    originalHandleImageUpload(event);
    setShowCardData(true);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-6 flex items-center relative">
        <div className="w-28 h-28 shadow-md rounded-full flex items-center justify-center mr-8 overflow-hidden relative">
          {uploadedImage ? (
            <img
              src={uploadedImage}
              alt="Uploaded Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
<img
  src="https://api.dicebear.com/9.x/rings/svg?seed=Samantha"
  alt="avatar" />         )}
        </div>
        <div>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <label
            htmlFor="photo"
            className="flex items-center bg-sky-400 shadow-md  text-white py-2 px-4 rounded-md cursor-pointer"
          >
            Upload Profile Image
            <CloudUploadIcon className="w-5 h-5 mx-2" />
          </label>
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
          What should we call you?
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="country" className="block text-gray-700 font-bold mb-2">
          Describe Your Business Activity
        </label>
        <input
          type="text"
          id="country"
          name="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-violet-600 mt-4 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : 'Continue'}
      </button>
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </form>
  );
}

export default ProfileData;
