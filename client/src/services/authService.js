import api from './api';

export const authService = {
  getNonce: (address) => api.post('/auth/nonce', { address }),
  verifySignature: (address, signature) => api.post('/auth/verify', { address, signature }),
  registerMerchant: (address) => api.post('/merchant/register', { address }),
  updateProfile: (profileData) => {
    return api.post('/merchant/profile', profileData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },
  addEmail: (data) => {
    return api.post('/merchant/email', data);
  },
  verifyEmailOTP: (data) => {
    return api.post('/merchant/verify-email', data);
  },
  addPhone: (data) => {
    return api.post('/merchant/phone', data);
  },
  verifyPhoneOTP: (data) => {
    return api.post('/merchant/verify-phone', data);
  },
};