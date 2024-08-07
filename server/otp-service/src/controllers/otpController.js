const otpService = require('../services/otpService');

exports.generateOtp = async (req, res) => {
  try {
    const { secretKey } = req.body;
    const otp = await otpService.generateOtp(secretKey);
    if (otp === null) {
      res.status(429).json({ message: 'Too many OTP generation attempts. Please try again later.' });
    } else {
      res.json({ otp });
    }
  } catch (error) {
    console.error('Error generating OTP:', error);
    res.status(500).json({ message: 'An error occurred while generating OTP' });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { secretKey, userInput } = req.body;
    const result = await otpService.verifyOtp(secretKey, userInput);
    res.json({ result });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'An error occurred while verifying OTP' });
  }
};