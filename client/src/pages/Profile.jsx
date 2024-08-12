import React from 'react';
import { Upload } from 'lucide-react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useProfile } from '../hooks/auth/useProfile';
import { useProfileContext } from '../hooks/ProfileProvider';

const Profile = () => {
  const {
    uploadedImage,
    name,
    setName,
    businessActivity,
    setBusinessActivity,
  } = useProfileContext();

  const {
    isLoading,
    handleImageUpload,
    handleSubmit,
    message
  } = useProfile();

  return (
    <div className="flex flex-col w-3/4">
      <main className="flex-grow container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">
          Hey! Get set to elevate your profile - we're about to make it stand out!
        </h1>
        
        
        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg">
          <div className="flex items-center space-x-5">
            <div className="w-16 h-16 shadow-sm rounded-full border-4 border-violet-300 flex items-center justify-center overflow-hidden">
              {uploadedImage ? (
                <img src={uploadedImage} alt="Uploaded Avatar" className="w-full h-full object-cover" />
              ) : (
                <img src="https://raw.githubusercontent.com/Volosh1n/github-avatars/master/examples/image.png" alt="avatar" className="w-full h-full object-cover" />
              )}
            </div>
            <label htmlFor="photo" className="cursor-pointer bg-violet-500 text-white text-sm py-2 px-3 rounded-2xl hover:bg-violet-700 transition duration-300 flex items-center">
              <Upload className="w-4 h-4 mr-1" />
              Select photo
              <input
                type="file"
                id="photo"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-1">
              What should we call you? <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-3 text-sm border-2 border-violet-400 rounded-xl focus:outline-none focus:border-violet-600 transition-all duration-300"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label htmlFor="businessActivity" className="block text-gray-700 text-sm font-semibold mb-1">
              Describe Your Business Activity <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="businessActivity"
              name="businessActivity"
              value={businessActivity}
              onChange={(e) => setBusinessActivity(e.target.value)}
              required
              className="w-full px-3 py-3 text-sm border-2 border-violet-400 rounded-xl focus:outline-none focus:border-violet-600 transition-all duration-300"
              placeholder="Enter your business activity"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-violet-600 text-white text-sm py-3 px-4 rounded-xl hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-all duration-300 font-semibold"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Continue'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Profile;  // Add this line at the end of the file