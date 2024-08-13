const Store = require('../models/Store');


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