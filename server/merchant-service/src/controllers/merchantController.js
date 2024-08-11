const merchantService = require('../services/merchantService');
const otpService = require('../services/otpService');
const notificationService = require('../services/notificationService');
const { RegistrationStep } = require('../models/Merchant');

exports.registerMerchant = async (req, res, next) => {
  try {
    const { address } = req.body;
    console.log("address wallet 1");
    console.log(address);

    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }
    
    const merchant = await merchantService.registerMerchant(address);
    res.status(201).json({ merchantId: merchant._id, step: merchant.registrationStep });
  } catch (error) {
    console.error('Error in registerMerchant:', error);
    if (error.message === 'Merchant with this address already exists') {
      return res.status(409).json({ error: error.message,  merchantId: address});
    }
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { username, businessActivity, address, image } = req.body;

    console.log('Received data:', { username, businessActivity, address });
    console.log('Image received:', !!image);

    const updatedMerchant = await merchantService.updateProfile(address, {
      image,
      username,
      businessActivity
    });

    if (!updatedMerchant) {
      return res.status(404).json({ error: 'Merchant not found' });
    }

    res.status(200).json({ step: updatedMerchant.registrationStep });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    next(error);
  }
};

exports.addEmail = async (req, res, next) => {
  try {
    const { email, address } = req.body;
    const merchant = await merchantService.addEmail(address, email);
    const otp = await otpService.generateOtp(merchant.secretKey);
    await notificationService.sendEmail(email, 'EMAIL_VERIFICATION', { codeOtpEmail: otp });
    res.status(200).json({ step: merchant.registrationStep });
  } catch (error) {
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { otp, address } = req.body;
    const merchant = await merchantService.getMerchantById(address);
    const isValid = await otpService.verifyOtp(merchant.secretKey, otp);
    if (isValid) {
      const updatedMerchant = await merchantService.verifyEmail(address);
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
    const { phone, address } = req.body;
    const merchant = await merchantService.addPhone(address, phone);
    const otp = await otpService.generateOtp(merchant.secretKey);
    // await notificationService.sendSMS(phone, 'PHONE_VERIFICATION', { codeOtpEmail: otp });
    await notificationService.sendEmail(merchant.email, 'EMAIL_VERIFICATION', { codeOtpEmail: otp });
    res.status(200).json({ step: merchant.registrationStep });
  } catch (error) {
    next(error);
  }
};

exports.verifyPhone = async (req, res, next) => {
  try {
    const { otp, address } = req.body;
    const merchant = await merchantService.getMerchantById(address);
    const isValid = await otpService.verifyOtp(merchant.secretKey, otp);
    if (isValid) {
      const updatedMerchant = await merchantService.verifyPhone(address);
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
    const id = address;
    const merchant = await merchantService.getMerchantById(id);
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