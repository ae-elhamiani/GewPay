const storeService = require('../services/storeService');

exports.createStore = async (req, res, next) => {
  try {
    const { address, blockchainStoreId, storeName } = req.body;
    if (!address || !blockchainStoreId || !storeName) {
      return res.status(400).json({ message: 'Address and blockchainStoreId are required' });
    }
    const store = await storeService.createStore(address, blockchainStoreId, storeName);
    res.status(201).json({ storeId: store._id });
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

exports.getStore = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    if (!storeId) {
      return res.status(400).json({ message: 'StoreId is required' });
    }

    const store = await storeService.getStoreById(storeId);
    res.status(200).json(store);
  } catch (error) {
    next(error);
  }
};


exports.getMerchantStores = async (req, res, next) => {
  try {
    const { merchantId } = req.params;
    const stores = await storeService.getMerchantStores(merchantId);
    res.status(200).json(stores);
  } catch (error) {
    next(error);
  }
};


exports.getAcceptedTokens = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    if (!storeId) {
      return res.status(400).json({ message: 'StoreId is required' });
    }
    const tokens = await storeService.getAcceptedTokens(storeId);
    res.status(200).json(tokens);
  } catch (error) {
    next(error);
  }
};