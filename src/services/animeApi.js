import axios from 'axios';

const API_BASE = 'https://api.jikan.moe/v4';

// Cache para armazenar os animes populares (usado como fallback)
let cachedAnimes = [];

// Define o cache (chame esta função após carregar os animes na Home)
export const setAnimesCache = (animes) => {
  cachedAnimes = animes;
};

// Busca local nos animes cacheados
export const searchLocalAnimes = (query) => {
  if (!query.trim() || cachedAnimes.length === 0) return [];
  return cachedAnimes.filter(anime =>
    anime.title.toLowerCase().includes(query.toLowerCase())
  );
};

// Buscar animes populares (top animes)
export const getPopularAnimes = async () => {
  try {
    const response = await axios.get(`${API_BASE}/top/anime?limit=20`);
    return response.data.data.map(anime => ({
      id: anime.mal_id,
      title: anime.title,
      image: anime.images.jpg.image_url,
      episodes: anime.episodes || '?',
      rating: anime.score || 'N/A',
      description: anime.synopsis || 'Sem descrição.',
      genres: anime.genres.map(g => g.name),
      year: anime.year || 'Desconhecido'
    }));
  } catch (error) {
    console.error('Erro ao buscar animes populares', error);
    return [];
  }
};

// Buscar anime por ID
export const getAnimeById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE}/anime/${id}`);
    const anime = response.data.data;
    return {
      id: anime.mal_id,
      title: anime.title,
      image: anime.images.jpg.image_url,
      episodes: anime.episodes || '?',
      rating: anime.score || 'N/A',
      description: anime.synopsis || 'Sem descrição.',
      genres: anime.genres.map(g => g.name),
      year: anime.year || 'Desconhecido'
    };
  } catch (error) {
    console.error('Erro ao buscar anime', error);
    return null;
  }
};

// Buscar lista de gêneros (para filtro)
export const getGenres = async () => {
  try {
    const response = await axios.get(`${API_BASE}/genres/anime`);
    return response.data.data;
  } catch (error) {
    console.error('Erro ao buscar gêneros', error);
    return [];
  }
};

// Buscar animes por um ou mais gêneros (array de IDs)
export const getAnimesByGenre = async (genreIds, limit = 20) => {
  if (!genreIds) return [];
  // Se for array, junta com vírgula; se já for string, usa como está
  const ids = Array.isArray(genreIds) ? genreIds.join(',') : genreIds;
  try {
    const response = await axios.get(`${API_BASE}/anime?genres=${ids}&limit=${limit}`);
    return response.data.data.map(anime => ({
      id: anime.mal_id,
      title: anime.title,
      image: anime.images.jpg.image_url,
      episodes: anime.episodes || '?',
      rating: anime.score || 'N/A',
      description: anime.synopsis || 'Sem descrição.',
      genres: anime.genres.map(g => g.name),
      year: anime.year || 'Desconhecido'
    }));
  } catch (error) {
    console.error('Erro ao buscar animes por gênero', error);
    return [];
  }
};

// Busca geral por nome
export const searchAnimes = async (query) => {
  if (!query.trim()) return [];
  try {
    const response = await axios.get(`${API_BASE}/anime?q=${encodeURIComponent(query)}&limit=50`);
    if (response.data && response.data.data && response.data.data.length > 0) {
      return response.data.data.map(anime => ({
        id: anime.mal_id,
        title: anime.title,
        image: anime.images.jpg.image_url,
        episodes: anime.episodes || '?',
        rating: anime.score || 'N/A',
        description: anime.synopsis || 'Sem descrição.',
        genres: anime.genres.map(g => g.name),
        year: anime.year || 'Desconhecido'
      }));
    } else {
      // Se a API retornou vazio, tenta busca local
      console.warn('API retornou vazio, usando fallback local');
      return searchLocalAnimes(query);
    }
  } catch (error) {
    console.error('Erro na busca, usando fallback local:', error);
    return searchLocalAnimes(query);
  }
};