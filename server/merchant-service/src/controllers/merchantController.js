const merchantService = require('../services/merchantService');

exports.registerMerchant = async (req, res, next) => {
  try {
    const { address } = req.body;
    const merchant = await merchantService.registerMerchant(address);
    res.status(201).json(merchant);
  } catch (error) {
    next(error);
  }
};

exports.getMerchantInfo = async (req, res, next) => {
  try {
    const { address } = req.params;
    const merchant = await merchantService.getMerchantInfo(address);
    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' });
    }
    res.json(merchant);
  } catch (error) {
    next(error);
  }
};

exports.updateMerchantProfile = async (req, res, next) => {
  try {
    const { address } = req.params;
    const updateData = req.body;
    const updatedMerchant = await merchantService.updateMerchantProfile(address, updateData);
    if (!updatedMerchant) {
      return res.status(404).json({ message: 'Merchant not found' });
    }
    res.json(updatedMerchant);
  } catch (error) {
    next(error);
  }
};