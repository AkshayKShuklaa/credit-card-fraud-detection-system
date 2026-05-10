import axios from 'axios';

const api = axios.create({
  baseURL: 'https://credit-card-fraud-detection-system-1-2f29.onrender.com',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
