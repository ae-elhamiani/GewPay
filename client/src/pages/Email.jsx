import React from 'react';
import useEmail from '../hooks/auth/useEmail';
import { useNavigate } from 'react-router-dom';

const Email = () => {
  const { email, setEmail, message, isLoading, handleSendOTP } = useEmail();

  return (
    <div>
      <h1 className="text-4xl font-extrabold text-violet-600">Let's validate your Email</h1>
      <p className="text-gray-600 mb-8 mt-4">
        Help us to ensure your progress stays safe and sound.
      </p>

      <form onSubmit={handleSendOTP}>
        <div className="mb-4 w-2/3">
          <label htmlFor="email" className="sr-only">
            Enter your email ID
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email ID"
            className="w-full px-3 py-2 border border-violet-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
            required
          />
        </div>
        <button
          type="submit"
          className="w-2/3 bg-violet-600 text-white py-2 px-4 mt-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
           disabled={isLoading}
          onClick={useNavigate('/verify-email-otp')}
        >
          {isLoading ? 'Sending...' : 'Send verification code'}
        </button>
        {message && (
          <p
            className={`mt-4 ${
              message.includes('sent') ? 'text-green-500' : 'text-green-500'
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default Email;
