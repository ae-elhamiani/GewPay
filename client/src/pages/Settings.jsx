import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { User, Shield, CreditCard, Bell, Edit, ChevronRight } from 'lucide-react';

const SettingsSection = ({ icon: Icon, title, description, link, isDarkMode }) => (
  <Link 
    to={link} 
    className={`block p-6 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center mb-4">
        <Icon className={`w-8 h-8 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} mr-3`} />
        <div>
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{title}</h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
        </div>
      </div>
      <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
    </div>
  </Link>
);

const ProfileSection = ({ name, email, avatar, isDarkMode, isKYCVerified }) => {
  const [avatarError, setAvatarError] = useState(false);

  const handleAvatarError = () => {
    setAvatarError(true);
  };

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md mb-6`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {avatarError || !avatar ? (
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUOAcFNdTjimU6HHzmZKc0ensdJsFlC6pfQg&s" alt="avatar" className="w-16 h-16 rounded-full mr-4 object-cover" />

            // <UserCircle className={`w-16 h-16 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'} mr-4`} />
          ) : (
            <img 
              src={avatar}
              alt={name} 
              className="w-16 h-16 rounded-full mr-4 object-cover"
              onError={handleAvatarError}
            />
          )}
          <div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{name}</h2>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{email}</p>
          </div>
        </div>
        <Link to="/dashboard/profile" className={`flex items-center ${isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'}`}>
          <Edit className="w-5 h-5 mr-1" />
          <span>Edit Profile</span>
        </Link>
      </div>
      <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Account Status</h3>
        <div className="flex items-center">
          {isKYCVerified ? (
            <>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'}`}>
                Verified
              </span>
              <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Your account is fully verified and active
              </span>
            </>
          ) : (
            <>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-yellow-800 text-yellow-200' : 'bg-yellow-100 text-yellow-800'}`}>
                Pending Verification
              </span>
              <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                KYC verification required
              </span>
              <Link 
                to="/dashboard/settings/kyc" 
                className={`ml-2 text-sm font-medium ${isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'}`}
              >
                Complete KYC
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Settings = () => {
  const context = useOutletContext();
  const isDarkMode = context?.isDarkMode ?? false;

  // Mock user data (replace with actual user data from your backend)
  const user = {
    name: "ae.elhamiani",
    email: "ae.elhamiani@gwepay.com",
    avatar: "https://i.imgur.com/esQgs9o.jpeg", // This should be the URL from your backend
    isKYCVerified: false // This should be fetched from your backend
  };

  return (
    <div className={`max-w-full mx-auto p-6 ${isDarkMode ? 'bg-gray-900 text-white' : ' text-gray-800'}`}>
      <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-purple-300' : 'text-purple-800'}`}>Account Settings</h1>
      
      <ProfileSection 
        name={user.name} 
        email={user.email} 
        avatar={user.avatar} 
        isDarkMode={isDarkMode} 
        isKYCVerified={user.isKYCVerified}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SettingsSection
          icon={User}
          title="KYC Settings"
          description="Manage your identity verification and KYC documents."
          link="/dashboard/settings/kyc"
          isDarkMode={isDarkMode}
        />
        <SettingsSection
          icon={Shield}
          title="Security Settings"
          description="Configure your account security and two-factor authentication."
          link="/dashboard/settings/security"
          isDarkMode={isDarkMode}
        />
        <SettingsSection
          icon={CreditCard}
          title="Payment Methods"
          description="Manage your connected payment methods and preferences."
          link="/dashboard/settings/payment"
          isDarkMode={isDarkMode}
        />
        <SettingsSection
          icon={Bell}
          title="Notifications"
          description="Customize your notification preferences for various activities."
          link="/dashboard/settings/notifications"
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};

export default Settings;