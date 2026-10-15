import axios from 'axios';
import { getToken, clearAuth } from '../utils/storage';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000' });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    // Invalid / expired JWT -> log out (but not for a failed login attempt)
    if (error.response?.status === 401 && !error.config.url.includes('/login')) {
      clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Turns any axios error into a readable message
export const getErrorMessage = (error) => {
  if (!error.response) return 'Network error. Please check your connection and try again.';
  const { status, data } = error.response;
  if (data?.message) return data.message;
  if (status === 404) return 'Resource not found';
  if (status === 401) return 'Unauthorized access';
  return 'Something went wrong';
};

export default api;
