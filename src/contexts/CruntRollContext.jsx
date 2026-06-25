import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, register as apiRegister, getProfile, uploadAvatar as apiUploadAvatar } from '../api/auth';
import { getFavorites, addFavorite as apiAddFavorite, removeFavorite as apiRemoveFavorite } from '../api/favorites';

const CruntRollContext = createContext();

export const useCruntRoll = () => useContext(CruntRollContext);

export const CruntRollProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  // Carregar favoritos do usuário logado
  const loadFavorites = async () => {
    try {
      const data = await getFavorites();
      setFavorites(data); // agora é um array
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      setFavorites([]);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('cruntroll_token');
    if (token) {
      getProfile()
        .then(async (userData) => {
          setUser(userData);
          setIsLoggedIn(true);
          await loadFavorites();
        })
        .catch(() => {
          localStorage.removeItem('cruntroll_token');
          setUser(null);
          setIsLoggedIn(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password);
      localStorage.setItem('cruntroll_token', data.token);
      setUser(data.user);
      setIsLoggedIn(true);
      await loadFavorites();
      return true;
    } catch (error) {
      console.error('Erro no login:', error.response?.data || error.message);
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      const data = await apiRegister(name, email, password);
      localStorage.setItem('cruntroll_token', data.token);
      setUser(data.user);
      setIsLoggedIn(true);
      await loadFavorites();
      return true;
    } catch (error) {
      console.error('Erro no registro:', error.response?.data || error.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('cruntroll_token');
    setUser(null);
    setIsLoggedIn(false);
    setFavorites([]);
  };

  const addFavorite = async (anime) => {
    try {
      await apiAddFavorite(anime.id, anime);
      await loadFavorites(); // recarrega lista completa
      return true;
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error);
      return false;
    }
  };

  const removeFavorite = async (animeId) => {
    try {
      await apiRemoveFavorite(animeId);
      await loadFavorites(); // recarrega lista completa
      return true;
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      return false;
    }
  };

  // 🔥 isFavorite agora é síncrona e usa o estado local
  const isFavorite = (animeId) => {
    return favorites.some(fav => fav.anime_id === animeId || fav.id === animeId);
  };

  const uploadAvatar = async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const result = await apiUploadAvatar(formData);
      setUser(prev => ({ ...prev, avatar: result.avatar }));
      return true;
    } catch (error) {
      console.error('Erro ao enviar avatar:', error);
      return false;
    }
  };

  return (
    <CruntRollContext.Provider value={{
      user,
      isLoggedIn,
      loading,
      favorites,
      login,
      register,
      logout,
      addFavorite,
      removeFavorite,
      isFavorite,
      uploadAvatar,
      loadFavorites
    }}>
      {children}
    </CruntRollContext.Provider>
  );
};