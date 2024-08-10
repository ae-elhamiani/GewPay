const { Merchant, RegistrationStep } = require('../models/Merchant');

exports.registerMerchant = async (address) => {
  const merchant = new Merchant({
    _id: address.toLowerCase(), 
    registrationStep: RegistrationStep.INITIAL
  });
  return await merchant.save();
};

exports.updateProfile = async (address, { image, username, businessActivity }) => {
  try {
    const updatedMerchant = await Merchant.findByIdAndUpdate(
      address.toLowerCase(), 
      { 
        image, 
        username, 
        businessActivity, 
        registrationStep: RegistrationStep.EMAIL 
      },
      { new: true }
    );

    if (!updatedMerchant) {
      console.log(`No merchant found with address: ${address}`);
    }

    return updatedMerchant;
  } catch (error) {
    console.error('Error in merchantService.updateProfile:', error);
    throw error;
  }
};

exports.addEmail = async (address, email) => {
  return await Merchant.findByIdAndUpdate(
    address.toLowerCase(),
    { email, emailVerified: false, registrationStep: RegistrationStep.VERIFY_EMAIL },
    { new: true }
  );
};

exports.verifyEmail = async (address) => {
  return await Merchant.findByIdAndUpdate(
    address.toLowerCase(),
    { emailVerified: true, registrationStep: RegistrationStep.PHONE },
    { new: true }
  );
};

exports.addPhone = async (address, phone) => {
  return await Merchant.findByIdAndUpdate(
    address.toLowerCase(),
    { phone, phoneVerified: false, registrationStep: RegistrationStep.VERIFY_PHONE },
    { new: true }
  );
};

exports.verifyPhone = async (address) => {
  return await Merchant.findByIdAndUpdate(
    address.toLowerCase(),
    { phoneVerified: true, registrationStep: RegistrationStep.COMPLETE },
    { new: true }
  );
};



exports.getMerchantById = async (id) => {
  return await Merchant.findById(id.toLowerCase());
};