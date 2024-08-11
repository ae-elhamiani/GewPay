import api from './api';

export const merchantService = {
  updateProfile: async (profileData) => {
    const response = await api.post('/profile', profileData);
    return response.data;
  },
  // Add other merchant-related services here
};