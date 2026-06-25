import React, { useEffect, useState } from 'react';
import AnimeCard from '../components/AnimeCard';
import { getPopularAnimes, setAnimesCache } from '../services/animeApi';

const Home = () => {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPopularAnimes();
        setAnimes(data);
        setAnimesCache(data); // 🔁 Armazena no cache para fallback da busca
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading">Carregando animes...</div>;
  if (error) return <div className="loading">Erro ao carregar. Tente novamente.</div>;

  return (
    <div>
      <div className="hero">
        <h1>Bem-vindo ao CruntRoll</h1>
        <p>Assista aos melhores animes legendados e dublados</p>
        <button className="btn">Comece agora</button>
      </div>
      <h2 className="section-title">Animes Populares</h2>
      <div className="anime-grid">
        {animes.map(anime => <AnimeCard key={anime.id} {...anime} />)}
      </div>
    </div>
  );
};

export default Home;