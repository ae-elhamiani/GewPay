const storeService = require('../services/storeService');

exports.createStore = async (req, res, next) => {
  try {
    const { address, blockchainStoreId } = req.body;
    if (!address || !blockchainStoreId) {
      return res.status(400).json({ message: 'Address and blockchainStoreId are required' });
    }
    const store = await storeService.createStore(address, blockchainStoreId);
    res.status(201).json({ storeId: store._id });
  } catch (error) {
    next(error);
  }
};