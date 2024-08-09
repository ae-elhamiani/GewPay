import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api'
});
api.interceptors.request.use((config) => {
    const merchantId = localStorage.getItem('merchantId');
    if (merchantId && config.method !== 'get') {
      config.data = { ...config.data, merchantId };
    }
    return config;
  });
  

export default api;