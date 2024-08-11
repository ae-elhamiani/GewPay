import React from 'react';
import OtpInput from 'react-otp-input';
import useEmailOTP from '../hooks/auth/useEmailOTP';
import { useNavigate } from 'react-router-dom';

const EmailOTP = () => {
  const navigate = useNavigate();
  const {
    otp,
    setOtp,
    message,
    isLoading,
    email,
    handleVerifyOTP,
    resendCode,
    resendCountdown
  } = useEmailOTP();

  return (
    <div className="flex flex-col w-3/4">
      <main className="flex-grow container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">
          Verification code sent - Let's make sure it's really you!
        </h1>

        <p className="text-gray-600 mb-8">
          Please enter the verification code we've just sent to your email box.
        </p>
        {message && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {message}
          </div>
        )}
        <div className="flex justify-between items-center mb-6">
          <span className="text-black font-bold">{email}</span>
          <button 
            className="text-violet-600 hover:underline font-bold"
            onClick={() => navigate('/register-email')}
          >
            Change Email
          </button>
        </div>


        <form onSubmit={handleVerifyOTP} className="space-y-6 rounded-lg">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="otp">
              Enter verification code
            </label>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderSeparator={<span className="w-6"></span>}
              renderInput={(props) => <input {...props} />}
              inputStyle={{
                width: '3rem',
                height: '3rem',
                margin: '0 0.5rem',
                fontSize: '1.5rem',
                borderRadius: '7px',
                border: '2px solid #4222DD',
              }}
              focusStyle={{
                border: '2px solid #999999',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.51)',
                outline: 'none'
              }}
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              className="text-violet-600 font-bold hover:underline disabled:text-gray-400"
              onClick={resendCode}
              disabled={resendCountdown > 0 || isLoading}
            >
              Resend code
            </button>
            {resendCountdown > 0 && (
              <span className="text-gray-500">(in {resendCountdown} seconds)</span>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-violet-600 text-white text-sm py-3 px-4 rounded-xl hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-all duration-300 font-semibold"
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default EmailOTP;