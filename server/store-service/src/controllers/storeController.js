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

exports.getStore = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    if (!storeId) {
      return res.status(400).json({ message: 'StoreId is required' });
    }
    const store = await storeService.getStoreById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.status(200).json(store);
  } catch (error) {
    next(error);
  }
};

exports.rotateApiKey = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const { oldApiKey } = req.body;
    if (!storeId || !oldApiKey) {
      return res.status(400).json({ message: 'StoreId and oldApiKey are required' });
    }
    const newApiKey = await storeService.rotateApiKey(storeId, oldApiKey);
    res.status(200).json({ apiKey: newApiKey });
  } catch (error) {
    next(error);
  }
};

exports.generateApiKey = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    if (!storeId) {
      return res.status(400).json({ message: 'StoreId is required' });
    }
    const apiKey = await storeService.generateApiKey(storeId);
    res.status(200).json({ apiKey });
  } catch (error) {
    next(error);
  }
};

exports.validateApiKey = async (req, res, next) => {
  try {
    const { storeId, apiKey } = req.body;
    if (!storeId || !apiKey) {
      return res.status(400).json({ message: 'StoreId and apiKey are required' });
    }
    const result = await storeService.validateApiKey(storeId, apiKey);
    
    if (result.isValid) {
      const isCompromised = await storeService.isApiKeyCompromised(storeId);
      if (isCompromised) {
        return res.status(403).json({ message: 'API key may be compromised. Please rotate your key.' });
      }
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};