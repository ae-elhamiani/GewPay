import React from 'react';
import { useProfileContext } from '../hooks/ProfileProvider';
import useEmail from '../hooks/auth/useEmail';

const Email = () => {
  const { email, setEmail } = useProfileContext();
  const { message, isLoading, handleSendOTP } = useEmail();

  const onSubmit = (e) => {
    e.preventDefault();
    handleSendOTP(email);
  };

  return (
    <div className="flex flex-col w-3/4">
      <main className="flex-grow container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">
          Let's validate your Email - Help us ensure your progress stays safe and sound!
        </h1>

        {message && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {message}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6 rounded-lg">
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-1">
              Enter your email ID <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-3 text-sm border-2 border-violet-400 rounded-xl focus:outline-none focus:border-violet-600 transition-all duration-300"
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-violet-600 text-white text-sm py-3 px-4 rounded-xl hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-all duration-300 font-semibold"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send verification code'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Email;