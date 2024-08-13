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


function generateSecureApiKey() {
    return `${uuidv4()}-${crypto.randomBytes(32).toString('hex')}`;
}