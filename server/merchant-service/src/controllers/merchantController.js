const merchantService = require('../services/merchantService');
const otpService = require('../services/otpService');
const notificationService = require('../services/notificationService');
const { RegistrationStep } = require('../models/Merchant');

exports.registerMerchant = async (req, res, next) => {
  try {
    const { address } = req.body;
    const merchant = await merchantService.registerMerchant(address);
    res.status(201).json({ merchantId: merchant._id, step: merchant.registrationStep });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { image, username,merchantId } = req.body;
    const updatedMerchant = await merchantService.updateProfile(merchantId, { image, username });
    res.status(200).json({ step: updatedMerchant.registrationStep });
  } catch (error) {
    next(error);
  }
};

exports.addEmail = async (req, res, next) => {
  try {
    const { email,merchantId } = req.body;
    const merchant = await merchantService.addEmail(merchantId, email);
    const otp = await otpService.generateOtp(merchant.secretKey);
    await notificationService.sendEmail(email, 'EMAIL_VERIFICATION', { codeOtpEmail: otp });
    res.status(200).json({ step: merchant.registrationStep });
  } catch (error) {
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { otp ,merchantId} = req.body;
    const merchant = await merchantService.getMerchantById(merchantId);
    const isValid = await otpService.verifyOtp(merchant.secretKey, otp);
    if (isValid) {
      const updatedMerchant = await merchantService.verifyEmail(merchantId);
      res.status(200).json({ step: updatedMerchant.registrationStep });
    } else {
      res.status(400).json({ error: 'Invalid OTP' });
    }
  } catch (error) {
    next(error);
  }
};

exports.addPhone = async (req, res, next) => {
  try {
    const { phone,merchantId } = req.body;
    const merchant = await merchantService.addPhone(merchantId, phone);
    const otp = await otpService.generateOtp(merchant.secretKey);
    await notificationService.sendSMS(phone, 'PHONE_VERIFICATION', { codeOtpEmail: otp });
    res.status(200).json({ step: merchant.registrationStep });
  } catch (error) {
    next(error);
  }
};

exports.verifyPhone = async (req, res, next) => {
  try {
    const { otp,merchantId } = req.body;
    const merchant = await merchantService.getMerchantById(merchantId);
    const isValid = await otpService.verifyOtp(merchant.secretKey, otp);
    if (isValid) {
      const updatedMerchant = await merchantService.verifyPhone(merchantId);
      res.status(200).json({ step: updatedMerchant.registrationStep });
    } else {
      res.status(400).json({ error: 'Invalid OTP' });
    }
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { address } = req.body;
    const merchant = await merchantService.getMerchantByAddress(address);
    if (!merchant) {
      return res.status(404).json({ error: 'Merchant not found' });
    }
    if (merchant.registrationStep === RegistrationStep.COMPLETE) {
      res.status(200).json({ redirect: '/dashboard' });
    } else {
      res.status(200).json({ step: merchant.registrationStep });
    }
  } catch (error) {
    next(error);
  }
};