import api from './client';

export const register = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const uploadAvatar = (formData) => {
  const token = localStorage.getItem('cruntroll_token');
  console.log('Token enviado:', token); // 🔥 verifica se o token existe
  return api.put('/auth/profile/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};


