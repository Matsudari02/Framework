import api from './client';

export const getFavorites = async () => {
  const response = await api.get('/favorites');
  // Garante que o array existe
  const favorites = response.data.favorites || [];
  // Se por acaso anime_data for string, converte para objeto
  return favorites.map(fav => {
    if (typeof fav.anime_data === 'string') {
      fav.anime_data = JSON.parse(fav.anime_data);
    }
    return fav;
  });
};

export const addFavorite = async (animeId, animeData) => {
  const response = await api.post('/favorites', { animeId, animeData });
  return response.data;
};

export const removeFavorite = async (animeId) => {
  const response = await api.delete(`/favorites/${animeId}`);
  return response.data;
};

export const checkFavorite = async (animeId) => {
  const response = await api.get(`/favorites/check/${animeId}`);
  return response.data.isFavorite;
};