import React from 'react';
import PhoneInput from 'react-phone-input-2';
import { useProfileContext } from '../hooks/ProfileProvider';
import 'react-phone-input-2/lib/style.css';
import usePhone from '../hooks/auth/usePhone';

const Phone = () => {
  const { phone, setPhone } = useProfileContext();
  const { message, isLoading, handleSendOTP } = usePhone();

  const onSubmit = (e) => {
    e.preventDefault();
    handleSendOTP();
  };

  return (
    <div className="flex flex-col w-3/4">
      <main className="flex-grow container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">
          Let's verify your phone number - Ensure secure communication!
        </h1>


        <form onSubmit={onSubmit} className="space-y-6 rounded-lg">
          <div>
            <label htmlFor="phone" className="block text-gray-700 text-sm font-semibold mb-1">
              Enter your phone number <span className="text-red-500">*</span>
            </label>
            <PhoneInput
              country={'ma'}
              value={phone}
              onChange={(value) => setPhone(value)}
              inputProps={{
                id: 'phone',
                required: true,
              }}
              containerClass="w-full"
              inputStyle={{
                width: '98%',
                height: '50px',
                marginLeft:'2%',
                fontSize: '16px',
                backgroundColor: '#f3f4f6',
                border: '2px solid #8b5cf6',
                borderRadius: '12px',
              }}
              buttonStyle={{
                paddingLeft: '8px',
                paddingRight: '5px',
                backgroundColor: '#fff',
                border: '2px solid #8b5cf6',
                borderRadius: '12px 0 0 12px',
              }}
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

export default Phone;