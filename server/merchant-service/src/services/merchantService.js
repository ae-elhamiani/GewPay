const { Merchant, RegistrationStep } = require('../models/Merchant');

exports.registerMerchant = async (address) => {
  if (!address) {
    throw new Error('Address is required');
  }
  const lowercaseAddress = address.toLowerCase();
  
  try {
    // Check if a merchant with this address already exists
    const existingMerchant = await Merchant.findById(lowercaseAddress);
    
    if (existingMerchant) {
      throw new Error('Merchant with this address already exists');
    }
    
    // If no existing merchant, create a new one
    const merchant = new Merchant({
      _id: lowercaseAddress,
      registrationStep: RegistrationStep.INITIAL
    });
    
    return await merchant.save();
  } catch (error) {
    if (error.message !== 'Merchant with this address already exists') {
      console.error('Error in registerMerchant:', error);
    }
    throw error;
  }
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