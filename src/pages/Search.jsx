import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AnimeCard from '../components/AnimeCard';
import { searchAnimes, getGenres, getAnimesByGenre, searchLocalAnimes } from '../services/animeApi';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genres, setGenres] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const loadGenres = async () => {
      const data = await getGenres();
      setGenres(data);
    };
    loadGenres();
  }, []);

  // Busca textual com debounce e fallback
  useEffect(() => {
    if (selectedGenres.length > 0) return;
    const timer = setTimeout(async () => {
      if (query.trim()) {
        setLoading(true);
        let data = await searchAnimes(query);
        // Se ainda não houver resultados, tenta busca local (já feita dentro de searchAnimes, mas garantimos)
        if (data.length === 0) {
          data = searchLocalAnimes(query);
        }
        setResults(data);
        setLoading(false);
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, selectedGenres]);

  // Busca por gêneros (múltiplos AND) – sem alterações
  useEffect(() => {
    if (selectedGenres.length === 0) return;
    setLoading(true);
    const firstGenre = selectedGenres[0];
    getAnimesByGenre(firstGenre).then(async data => {
      if (selectedGenres.length > 1) {
        data = data.filter(anime =>
          selectedGenres.every(genreId =>
            anime.genres.some(g =>
              g.toLowerCase() === (genres.find(g => g.mal_id === genreId)?.name || '').toLowerCase()
            )
          )
        );
      }
      setResults(data);
      setLoading(false);
    });
  }, [selectedGenres, genres]);

  // Sincronizar com URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) {
      setQuery(q);
      setSelectedGenres([]);
      searchAnimes(q).then(data => {
        if (data.length === 0) data = searchLocalAnimes(q);
        setResults(data);
      });
    }
  }, [location.search]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value) setSelectedGenres([]);
  };

  const handleGenreToggle = (genreId) => {
    setSelectedGenres(prev => {
      const newGenres = prev.includes(genreId) ? prev.filter(id => id !== genreId) : [...prev, genreId];
      if (newGenres.length > 0) setQuery('');
      return newGenres;
    });
  };

  return (
    <div className="search-page">
      <h1>Explorar Animes</h1>
      <div className="search-layout">
        <aside className="search-sidebar">
          <h3>Gêneros</h3>
          <div className="genres-list">
            {genres.slice(0, 20).map(genre => (
              <label key={genre.mal_id} className="genre-checkbox">
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(genre.mal_id)}
                  onChange={() => handleGenreToggle(genre.mal_id)}
                />
                {genre.name}
              </label>
            ))}
          </div>
        </aside>
        <div className="search-content">
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={query}
            onChange={handleSearchChange}
            className="search-input-large"
          />
          {loading && <div className="loading">Buscando...</div>}
          {!loading && results.length > 0 && (
            <div className="anime-grid">
              {results.map(anime => <AnimeCard key={anime.id} {...anime} />)}
            </div>
          )}
          {!loading && results.length === 0 && (query || selectedGenres.length > 0) && (
            <p>Nenhum anime encontrado.</p>
          )}
          {!loading && !query && selectedGenres.length === 0 && (
            <p>Digite um nome ou selecione gêneros para começar.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;