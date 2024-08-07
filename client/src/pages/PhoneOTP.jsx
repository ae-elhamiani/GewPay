import React from 'react';
import OtpInput from 'react-otp-input';
import usePhoneOTP from '../hooks/auth/usePhoneOTP';
import { useNavigate } from 'react-router-dom';

const PhoneOTP = () => {
  const navigate = useNavigate();

  const {
    otp,
    setOtp,
    message,
    isLoading,
    phone,
    handleVerifyOTP,
    resendCode,
    resendCountdown,
  } = usePhoneOTP();

  return (
    <div className="flex flex-col justify-start px-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-xxl font-extrabold text-violet-600">Verification code sent</h1>
        <p className="text-gray-600 text-xl ">
          Please enter the verification code we've just sent to your phone number.
        </p>
        <div className="flex justify-between items-center">
          <span className="text-black font-bold">{phone}+212674835458</span>
          <button className="text-violet-600 hover:underline font-bold " onClick={() => {navigate('/register-phone')}}>
            Change Number
          </button>
        </div>
        <form onSubmit={handleVerifyOTP}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otp">
              Enter verification code
            </label>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderSeparator={<span className="w-2"></span>}
              renderInput={(props) => <input {...props} />}
              inputStyle={{
                width: '3.5rem',
                height: '3.5rem',
                fontSize: '1.5rem',
                borderRadius: '0.375rem',
                border: '2px solid #D1D5DB',
                outline: 'none',
              }}
              focusStyle={{
                border: '2px solid #3B82F6',
                boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)',
              }}
              inputType="tel"
              containerStyle="flex justify-between"
            />
          </div>
          <div className="flex justify-between items-center mb-4">
            <button
              type="button"
              className="text-black-600  font-bold underline hover:underline disabled:text-gray-400"
              onClick={resendCode}
              disabled={isLoading}
            >
              Resend code
            </button>
            {resendCountdown > 0 && (
              <span className="text-gray-500">(in {resendCountdown} seconds)</span>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-violet-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isLoading}
          >
            Submit
          </button>
        </form>
        {message && <p className="mt-2 text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default PhoneOTP;
