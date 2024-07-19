const express = require('express');
const User = require('../models/User');
const generateOTP = require('../utils/generateOTP');
const sendEmail = require('../utils/sendEmail');

const router = express.Router();

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes

// Register email and send OTP
router.post('/register-email', async (req, res) => {
  const { email, walletAddress } = req.body;

  if (!email || !walletAddress) {
    return res
      .status(400)
      .json({
        success: false,
        message: 'Email and wallet address are required',
      });
  }

  try {
    let user = await User.findById(walletAddress);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const currentTime = new Date().getTime();
    if (
      user.otpLockoutTime &&
      currentTime < new Date(user.otpLockoutTime).getTime()
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            'Too many attempts. Please wait before requesting a new OTP.',
        });
    }

    const existingUserWithEmail = await User.findOne({
      email,
      _id: { $ne: walletAddress },
    });
    if (existingUserWithEmail) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'Email already registered to another account',
        });
    }

    const otp = generateOTP(user.secret || walletAddress);
    user.email = email;
    user.emailOtpHash = otp;
    user.emailOtpSentAt = new Date();
    user.emailotpAttempts = 0; // Reset attempts on new OTP generation
    await user.save();

    await sendEmail(
      email,
      'Your Verification Code',
      `Your OTP is ${otp} and it will expire in 5 minutes.`
    );
    res.json({ success: true, message: 'Verification code sent successfully' });
  } catch (error) {
    console.error('Error registering email:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'Failed to register email',
        error: error.message,
      });
  }
});

// Verify OTP
router.post('/verify-email-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res
      .status(400)
      .json({ success: false, message: 'Email and OTP are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    if (user.emailOtpHash !== otp) {
      user.emailotpAttempts += 1;

      if (user.emailotpAttempts >= MAX_ATTEMPTS) {
        user.otpLockoutTime = new Date(new Date().getTime() + LOCKOUT_DURATION);
        await user.save();
        return res
          .status(400)
          .json({
            success: false,
            message:
              'Too many attempts. Please wait 30 minutes before trying again.',
          });
      }

      await user.save();
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    const otpExpiration = 5 * 60 * 1000; // 5 minutes
    const otpSentTime = new Date(user.emailOtpSentAt).getTime();
    const currentTime = new Date().getTime();

    if (currentTime - otpSentTime > otpExpiration) {
      return res
        .status(400)
        .json({ success: false, message: 'OTP has expired' });
    }

    user.emailVerified = true;
    user.emailOtpHash = undefined;
    user.emailOtpSentAt = undefined;
    user.emailotpAttempts = 0; // Reset attempts on successful verification
    user.otpLockoutTime = undefined; // Clear lockout time
    await user.save();

    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
