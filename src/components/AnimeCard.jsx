import React from 'react';
import { Link } from 'react-router-dom';
import { useCruntRoll } from '../contexts/CruntRollContext';
import './AnimeCard.css';

const AnimeCard = ({ id, title, image, episodes, rating }) => {
  const { isFavorite } = useCruntRoll();
  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/300x450?text=Imagem+Indisponível";
  };

  return (
    <div className="anime-card">
      <Link to={`/anime/${id}`}>
        <img src={image} alt={title} className="anime-card__image" onError={handleImageError} />
        <div className="anime-card__info">
          <h3 className="anime-card__title">
            {title} {isFavorite(id) && <span className="heart-icon">❤️</span>}
          </h3>
          <div className="anime-card__meta">
            <span>{episodes} episódios</span>
            <span className="rating">⭐ {rating}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AnimeCard;