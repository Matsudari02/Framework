import React from 'react';
import { useCruntRoll } from '../contexts/CruntRollContext';
import AnimeCard from '../components/AnimeCard';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const { favorites, isLoggedIn } = useCruntRoll();

  // Debug: veja no console o que está sendo recebido
  console.log('Favoritos no estado:', favorites);

  if (!isLoggedIn) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Você precisa estar logado para ver seus favoritos</h2>
        <Link to="/auth" className="btn" style={{ marginTop: '1rem', display: 'inline-block' }}>Fazer login</Link>
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Você ainda não tem animes favoritos</h2>
        <Link to="/search" className="btn" style={{ marginTop: '1rem', display: 'inline-block' }}>Explorar animes</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Meus Favoritos</h1>
      <div className="anime-grid">
        {favorites.map(fav => {
          // Extrai os dados do anime
          const anime = fav.anime_data || fav;
          // Se ainda assim não tiver título, pode ser que a estrutura seja diferente
          if (!anime.title) {
            console.warn('Favorito sem título:', fav);
            return null;
          }
          return <AnimeCard key={anime.id} {...anime} />;
        })}
      </div>
    </div>
  );
};

export default Favorites;