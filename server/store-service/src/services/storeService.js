const Store = require('../models/Store');
const Token = require('../models/Token');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { fetchStoreData } = require('./graphqlClient');


exports.createStore = async (address, blockchainStoreId, storeName) => {
    const merchantId = address;
    const storeId = `${merchantId}-${blockchainStoreId}`;

    const store = new Store({
    _id: storeId,
    merchantId,
    blockchainStoreId,
    storeName
    });

    await store.save();
    return store;
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

exports.getStoreById = async (storeId) => {
  try {
    const storeDB = await Store.findById(storeId);
    
    if (!storeDB) {
      throw new Error('Store not found in database');
    }

    const blockchainData = await fetchStoreData(storeDB.merchantId, storeDB.blockchainStoreId);

    const mergedStore = {
      _id: storeDB._id,
      storeName: storeDB.storeName,
      merchantId: storeDB.merchantId,
      blockchainStoreId: storeDB.blockchainStoreId,
      apiKey: storeDB.apiKey,
      apiKeyLastUsed: storeDB.apiKeyLastUsed,
      apiKeyUsageCount: storeDB.apiKeyUsageCount,
      createdAt: storeDB.createdAt,
      acceptedTokens: blockchainData.acceptedTokens,
      transactionCount: blockchainData.transactionCount,
      transactionVolume: blockchainData.transactionVolume,
      blockchainCreatedAt: blockchainData.createdAt,
      merchant: blockchainData.merchant,
      todayStats: blockchainData.todayStats,
      status: storeDB.apiKey 
        ? (storeDB.apiKeyUsageCount == 0 ? 'API KEY ..' : 'ACTIVE') 
        : 'NEW'
    };

    return mergedStore;
  } catch (error) {
    console.error('Error fetching store data:', error);
    throw error;
  }
};

exports.generateApiKey = async (storeId) => {
  try {
    const store = await Store.findById(storeId);
    if (!store) {
      throw new Error('Store not found');
    }
  
    const apiKey = generateSecureApiKey();
    store.apiKey = apiKey;
    store.apiKeyLastUsed = null;
    store.apiKeyUsageCount = 0;
    await store.save();
  
    return { apiKey };
  } catch (error) {
    console.error('Error generating API key:', error);
    throw error;
  }
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


exports.getMerchantStores = async (merchantId) => {
  try {
    const stores = await Store.find({ merchantId });
    const storesWithBlockchainData = await Promise.all(stores.map(async (store) => {
      const blockchainData = await fetchStoreData(merchantId, store.blockchainStoreId);
      return {
        _id: store._id,
        storeName: store.storeName,
        merchantId: store.merchantId,
        blockchainStoreId: store.blockchainStoreId,
        apiKey: store.apiKey,
        apiKeyLastUsed: store.apiKeyLastUsed,
        apiKeyUsageCount: store.apiKeyUsageCount,
        todayStats: blockchainData.todayStats,
        transactionCount: blockchainData.transactionCount,
        transactionVolume: blockchainData.transactionVolume,
        createdAt: store.createdAt,
        updatedAt: store.updatedAt,
        status: store.apiKey 
        ? (store.apiKeyUsageCount == 0 ? 'API KEY ..' : 'ACTIVE') 
        : 'NEW'
    };
    }));
    return storesWithBlockchainData;
  } catch (error) {
    console.error('Error fetching merchant stores:', error);
    throw new Error('Failed to fetch merchant stores');
  }
};


exports.getAcceptedTokens = async (storeId) => {
  try {
    const store = await Store.findById(storeId);
    if (!store) {
      throw new Error('Store not found');
    }

    const blockchainData = await fetchStoreData(store.merchantId, store.blockchainStoreId);
    const acceptedTokenAddresses = blockchainData.acceptedTokens.map(token => token.toLowerCase());

    const tokens = await Token.find({ addressToken: { $in: acceptedTokenAddresses } });

    return tokens;
  } catch (error) {
    console.error('Error fetching accepted tokens:', error);
    throw error;
  }
};



// exports.getMerchantStores = async (merchantId) => {
//   try {
//     const stores = await Store.find({ merchantId });
//     const storesWithBlockchainData = await Promise.all(stores.map(async (store) => {
//       try {
//         const blockchainData = await fetchStoreData(merchantId, store.blockchainStoreId);
//         return {
//           _id: store._id,
//           storeName: store.storeName,
//           merchantId: store.merchantId,
//           blockchainStoreId: store.blockchainStoreId,
//           apiKey: store.apiKey,
//           apiKeyLastUsed: store.apiKeyLastUsed,
//           apiKeyUsageCount: store.apiKeyUsageCount,
//           todayStats: blockchainData?.todayStats || {},
//           transactionCount: blockchainData?.transactionCount || 0,
//           transactionVolume: blockchainData?.transactionVolume || 0,
//           createdAt: store.createdAt,
//           updatedAt: store.updatedAt,
//           status: store.apiKey
//             ? (store.apiKeyLastUsed ? 'ACTIVE' : 'API KEY ..')
//             : 'NEW'
//         };
//       } catch (error) {
//         console.error('Error fetching store data from blockchain:', error);
//         return {
//           _id: store._id,
//           storeName: store.storeName,
//           merchantId: store.merchantId,
//           blockchainStoreId: store.blockchainStoreId,
//           apiKey: store.apiKey,
//           apiKeyLastUsed: store.apiKeyLastUsed,
//           apiKeyUsageCount: store.apiKeyUsageCount,
//           todayStats: {},
//           transactionCount: 0,
//           transactionVolume: 0,
//           createdAt: store.createdAt,
//           updatedAt: store.updatedAt,
//           status: store.apiKey
//             ? (store.apiKeyLastUsed ? 'ACTIVE' : 'API KEY ..')
//             : 'NEW',
//           error: 'Failed to fetch blockchain data'
//         };
//       }
//     }));
//     return storesWithBlockchainData;
//   } catch (error) {
//     console.error('Error fetching merchant stores:', error);
//     throw new Error('Failed to fetch merchant stores');
//   }
// };
