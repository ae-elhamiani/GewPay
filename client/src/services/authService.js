import api from './api';

export const authService = {
  getNonce: (address) => api.post('/auth/nonce', { address }),
  verifySignature: (address, signature) => api.post('/auth/verify', { address, signature }),
  registerMerchant: (address) => api.post('/merchant/register', { address }),
  updateProfile: (formData) => api.post('/merchant/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
     }),
};
