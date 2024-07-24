const Merchant = require('../models/Merchant');

exports.registerMerchant = async (address) => {
  const merchant = new Merchant({ address, isRegistered: true });
  return await merchant.save();
};

exports.getMerchantInfo = async (address) => {
  return await Merchant.findOne({ address });
};

exports.updateMerchantProfile = async (address, updateData) => {
  return await Merchant.findOneAndUpdate(
    { address },
    { ...updateData, profileCompleted: true },
    { new: true }
  );
};