import api from './client';

export const getUserProfile = async () => {
  const response = await api.get('/users/me');
  return response.data;
};