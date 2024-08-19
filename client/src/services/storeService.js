import api from './api';

export const storeService = {
  getTokens: () => api.get('/store/tokens'),
  createStore: (address, blockchainStoreId, storeName) => api.post('/store/create', { address, blockchainStoreId, storeName}),
  getStores: () => api.get('/store/stores'),
  getMerchantStores: (merchantId) => api.get(`/store/merchant/${merchantId}`),
  getStoreById: (storeId) => api.get(`/store/get/${storeId}`),
  generateApiKey: (storeId) => api.post(`/store/api-key/${storeId}`),
  rotateApiKey: (storeId, oldApiKey) => api.post(`/store/rotate-api-key/${storeId}`, { oldApiKey }),
  getAcceptedTokens: (storeId) => api.get(`/store/accepted-tokens/${storeId}`),

};

export default storeService;