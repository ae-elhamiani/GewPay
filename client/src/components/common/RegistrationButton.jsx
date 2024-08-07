import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProfile } from '../../contexts/profileContext';

const RegistrationButton = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    handleSubmit,
    handleSendEmailOTP,
    handleVerifyEmailOTP,
    handleSendPhoneOTP,
    handleVerifyPhoneOTP,
  } = useProfile();

  const handleClick = () => {
    switch (location.pathname) {
      // case '/register-email':
      //   handleSendEmailOTP();
      //   break;
      // case '/verify-email-otp':
      //   handleVerifyEmailOTP();
      //   break;
      // case '/register-phone':
      //   handleSendPhoneOTP();
      //   break;
      // case '/verify-phone-otp':
      //   handleVerifyPhoneOTP();
      //   break;
      case '/profile':
        handleSubmit();
        break;
      default:
        navigate('/profile');
        break;
    }
  };

  return (
    <div className="flex justify-between items-center w-custom">
      <button
        type="button"
        className="flex items-center text-gray-500 text-lg rounded-md"
        onClick={() => navigate(-1)}
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M7.707 14.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l3.293 3.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
        Back
      </button>
      <button
        type="submit"
        onClick={handleClick}
        className="bg-violet-500 text-white py-2 px-6 rounded-md text-lg focus:outline-none hover:bg-blue-700"
      >
        Continue
      </button>
    </div>
  );
};

export default RegistrationButton;
