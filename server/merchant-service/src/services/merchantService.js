const { Merchant, RegistrationStep } = require('../models/Merchant');

exports.registerMerchant = async (address) => {
  const merchant = new Merchant({ address, registrationStep: RegistrationStep.INITIAL });
  return await merchant.save();
};

exports.updateProfile = async (merchantId, { image, username }) => {
  return await Merchant.findByIdAndUpdate(
    merchantId,
    { image, username, registrationStep: RegistrationStep.EMAIL },
    { new: true }
  );
};

exports.addEmail = async (merchantId, email) => {
  return await Merchant.findByIdAndUpdate(
    merchantId,
    { email, emailVerified: false, registrationStep: RegistrationStep.VERIFY_EMAIL },
    { new: true }
  );
};

exports.verifyEmail = async (merchantId) => {
  return await Merchant.findByIdAndUpdate(
    merchantId,
    { emailVerified: true, registrationStep: RegistrationStep.PHONE },
    { new: true }
  );
};

exports.addPhone = async (merchantId, phone) => {
  return await Merchant.findByIdAndUpdate(
    merchantId,
    { phone, phoneVerified: false, registrationStep: RegistrationStep.VERIFY_PHONE },
    { new: true }
  );
};

exports.verifyPhone = async (merchantId) => {
  return await Merchant.findByIdAndUpdate(
    merchantId,
    { phoneVerified: true, registrationStep: RegistrationStep.COMPLETE },
    { new: true }
  );
};

exports.getMerchantBy = async (address) => {
  return await Merchant.findOne({ address });
};

exports.getMerchantById = async (id) => {
  return await Merchant.findById(id);
};