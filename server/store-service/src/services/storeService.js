const Store = require('../models/Store');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');


exports.createStore = async (address, blockchainStoreId) => {
    const merchantId = address;
    const storeId = `${merchantId}-${blockchainStoreId}`;

    const store = new Store({
    _id: storeId,
    merchantId,
    blockchainStoreId
    });

    await store.save();
    return store;
};


exports.getStoreById = async (storeId) => {
    return await Store.findById(storeId);
};


exports.rotateApiKey = async (storeId, oldApiKey) => {
    const store = await Store.findOne({ _id: storeId, apiKey: oldApiKey });
    if (!store) {
        throw new Error('Invalid store ID or API key');
    }

    const newApiKey = generateSecureApiKey();
    store.apiKey = newApiKey;
    store.apiKeyLastUsed = new Date();
    store.apiKeyUsageCount = 0;
    await store.save();

    return newApiKey;
};

exports.generateApiKey = async (storeId) => {
    const store = await Store.findById(storeId);
    if (!store) {
      throw new Error('Store not found');
    }
  
    const apiKey = generateSecureApiKey();
    store.apiKey = apiKey;
    await store.save();
  
    return apiKey;
  };

  exports.validateApiKey = async (storeId, apiKey) => {
    const store = await Store.findOne({ _id: storeId, apiKey });
    if (store) {
      store.apiKeyLastUsed = new Date();
      store.apiKeyUsageCount += 1;
      await store.save();
      return { isValid: true, storeId: store._id };
    } else {
      return { isValid: false };
    }
  };

  exports.isApiKeyCompromised = async (storeId) => {
    const store = await Store.findById(storeId);
    if (!store) {
      throw new Error('Store not found');
    }
  
    const threshold = 1000; // Example threshold
    const timeThreshold = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
    if (store.apiKeyUsageCount > threshold && 
        (new Date() - store.apiKeyLastUsed) < timeThreshold) {
      return true;
    }
  
    return false;
  };

function generateSecureApiKey() {
    return `${uuidv4()}-${crypto.randomBytes(32).toString('hex')}`;
}