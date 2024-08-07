import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const Phone = () => {
  const [countryCode, setCountryCode] = useState('256');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sending verification code to:', `+${countryCode}${phoneNumber}`);
  };

  return (
    <div className="flex flex-col justify-start px-4">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Enter your Phone Number</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex mb-4 space-x-2">
            <div className="w-1/3">
              <PhoneInput
                country={'ma'}
                value={countryCode}
                onChange={(value) => setCountryCode(value)}
                inputProps={{
                  readOnly: true,
                }}
                containerClass="w-full"
                inputStyle={{
                  width: '100%',
                  height: '48px',
                  fontSize: '16px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                buttonStyle={{
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px 0 0 8px',
                }}
              />
            </div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-2/3 h-12 px-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Phone number"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-violet-600 text-white rounded-lg font-medium text-base hover:bg-indigo-700 transition duration-200"
          >
            Send verification code
          </button>
        </form>
      </div>
    </div>
  );
};

export default Phone;