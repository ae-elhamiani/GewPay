const express = require('express');
const User = require('../models/User');
const twilio = require('twilio');
const router = express.Router();

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

router.post('/register-phone', async (req, res) => {
  const { phone, walletAddress } = req.body;
  if (!phone || !walletAddress) {
    return res
      .status(400)
      .json({
        success: false,
        message: 'Phone number and wallet address are required',
      });
  }
  try {
    let user = await User.findById(walletAddress);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }
    user.phone = phone;
    await user.save();

    const verification = await twilioClient.verify
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({ to: phone, channel: 'sms' });

    res
      .status(200)
      .json({
        success: true,
        message: 'Phone registered successfully. OTP sent.',
      });
  } catch (error) {
    console.error('Error registering phone:', error); // Log the error to the console
    res
      .status(500)
      .json({
        success: false,
        message: 'Failed to register phone',
        error: error.message,
      });
  }
});

router.post('/verify-phone-otp', async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return res
      .status(400)
      .json({ success: false, message: 'Phone number and OTP are required' });
  }
  try {
    const verificationCheck = await twilioClient.verify
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({ to: phone, code: otp });
    if (verificationCheck.status === 'approved') {
      await User.findOneAndUpdate({ phone }, { phoneVerified: true });
      res
        .status(200)
        .json({
          success: true,
          message: 'Phone number verified successfully!',
        });
    } else {
      res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error.message);
    res
      .status(500)
      .json({
        success: false,
        message: 'Failed to verify OTP',
        error: error.message,
      });
  }
});

module.exports = router;
