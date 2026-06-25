import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { login as apiLogin, register as apiRegister, getProfile, uploadAvatar as apiUploadAvatar } from '../api/auth';
import { getFavorites, addFavorite as apiAddFavorite, removeFavorite as apiRemoveFavorite } from '../api/favorites';
import { toast } from 'react-toastify';

const CruntRollContext = createContext();

export const useCruntRoll = () => useContext(CruntRollContext);

export const CruntRollProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  // 🔥 useCallback para evitar recriação de funções
  const loadFavorites = useCallback(async () => {
    try {
      const data = await getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('cruntroll_token');
    if (token) {
      getProfile()
        .then((response) => {
          const userData = response.user || response.data?.user;
          if (userData) {
            setUser(userData);
            setIsLoggedIn(true);
            loadFavorites();
          }
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
  }, [loadFavorites]); // dependência correta

  const login = useCallback(async (email, password) => {
    try {
      const data = await apiLogin(email, password);
      localStorage.setItem('cruntroll_token', data.token);
      setUser(data.user);
      setIsLoggedIn(true);
      await loadFavorites();
      toast.success('Login realizado com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      toast.error(error.response?.data?.error || 'Erro ao fazer login');
      return false;
    }
  }, [loadFavorites]);

  const register = useCallback(async (name, email, password) => {
    try {
      const data = await apiRegister(name, email, password);
      localStorage.setItem('cruntroll_token', data.token);
      setUser(data.user);
      setIsLoggedIn(true);
      await loadFavorites();
      toast.success('Cadastro realizado com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro no registro:', error);
      toast.error(error.response?.data?.error || 'Erro ao registrar');
      return false;
    }
  }, [loadFavorites]);

  const logout = useCallback(() => {
    localStorage.removeItem('cruntroll_token');
    setUser(null);
    setIsLoggedIn(false);
    setFavorites([]);
    toast.info('Você saiu da sua conta.');
  }, []);

  const addFavorite = useCallback(async (anime) => {
    try {
      await apiAddFavorite(anime.id, anime);
      await loadFavorites();
      toast.success('Anime adicionado aos favoritos!');
      return true;
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error);
      toast.error(error.response?.data?.error || 'Erro ao adicionar');
      return false;
    }
  }, [loadFavorites]);

  const removeFavorite = useCallback(async (animeId) => {
    try {
      await apiRemoveFavorite(animeId);
      await loadFavorites();
      toast.success('Anime removido dos favoritos!');
      return true;
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      toast.error(error.response?.data?.error || 'Erro ao remover');
      return false;
    }
  }, [loadFavorites]);

  const isFavorite = useCallback((animeId) => {
    return favorites.some(fav => fav.anime_id === animeId || fav.id === animeId);
  }, [favorites]);

  const uploadAvatar = useCallback(async (file) => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    const result = await apiUploadAvatar(formData);
    // Verifica onde está o user na resposta
    const updatedUser = result.data?.user || result.user;
    if (updatedUser) {
      // Atualiza o estado com o novo user (que contém avatar)
      setUser(prev => ({ ...prev, ...updatedUser }));
      toast.success('Avatar atualizado!');
      return true;
    }
    toast.warning('Avatar enviado, mas não foi possível atualizar os dados.');
    return false;
  } catch (error) {
    console.error('Erro no upload:', error);
    toast.error(error.response?.data?.error || 'Erro ao enviar avatar');
    return false;
  }
}, []);

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