const axios = require('axios');
const { getServiceUrl } = require('./serviceDiscovery');

exports.generateOtp = async (secretKey) => {
  try {
    const otpServiceUrl = await getServiceUrl('otp-service');
    const response = await axios.post(`${otpServiceUrl}/generate`, { secretKey });
    return response.data.otp;
  } catch (error) {
    console.error('Failed to generate OTP:', error);
    throw new Error('Failed to generate OTP');
  }
};

exports.verifyOtp = async (secretKey, userInput) => {
  try {
    const otpServiceUrl = await getServiceUrl('otp-service');
    const response = await axios.post(`${otpServiceUrl}/verify`, { secretKey, userInput });
    return response.data.result === 'VALID';
  } catch (error) {
    console.error('Failed to verify OTP:', error);
    throw new Error('Failed to verify OTP');
  }
};