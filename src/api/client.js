import axios from 'axios';

// Usa a variável de ambiente ou fallback para localhost:5000
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor para adicionar token JWT
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('cruntroll_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default api;