import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAnimeById } from '../services/animeApi';
import { useCruntRoll } from '../contexts/CruntRollContext';

const AnimeDetails = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addFavorite, removeFavorite, isFavorite, isLoggedIn } = useCruntRoll();

  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);
      const data = await getAnimeById(id);
      setAnime(data);
      setLoading(false);
    };
    fetchAnime();
  }, [id]);

  const handleFavorite = async () => {
    if (!isLoggedIn) {
      alert('Faça login para adicionar aos favoritos');
      return;
    }
    const animeId = parseInt(id);
    if (isFavorite(animeId)) {
      await removeFavorite(animeId);
    } else {
      if (anime) await addFavorite(anime);
    }
  };

  if (loading) return <div className="loading">Carregando detalhes...</div>;
  if (!anime) return <div>Anime não encontrado</div>;

  return (
    <div className="anime-details">
      <div className="details-banner">
        <img 
          src={anime.image} 
          alt={anime.title} 
          onError={(e) => e.target.src = "https://via.placeholder.com/300x450?text=Imagem+Indisponível"}
        />
        <div className="details-info">
          <h1>{anime.title}</h1>
          <p>{anime.description}</p>
          <p><strong>Episódios:</strong> {anime.episodes}</p>
          <p><strong>Avaliação:</strong> ⭐ {anime.rating}</p>
          <p><strong>Gêneros:</strong> {anime.genres?.join(', ')}</p>
          <p><strong>Ano:</strong> {anime.year}</p>
          <button className="btn" onClick={handleFavorite}>
            {isFavorite(anime.id) ? '❤️ Remover dos favoritos' : '🤍 Adicionar aos favoritos'}
          </button>
          <button className="btn" style={{ marginLeft: '10px' }}>Assistir agora</button>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetails;