import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // SSR-safe localStorage access and consistent key name "jwtToken"
    const token = typeof window !== 'undefined' ? localStorage.getItem('jwtToken') : null;

    if (token) {
      // set Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized access - Token might be invalid or expired. Logging out.');
      // Remove the correct token key
      if (typeof window !== 'undefined') localStorage.removeItem('jwtToken');
    }
    return Promise.reject(error);
  }
);

export default api;