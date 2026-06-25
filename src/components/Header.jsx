import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCruntRoll } from '../contexts/CruntRollContext';
import './Header.css';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useCruntRoll();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          <span style={{ color: '#f47521' }}>Crunt</span>Roll
        </Link>
        <nav className="nav">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Início
          </NavLink>
          <NavLink to="/search" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Explorar
          </NavLink>
          {isLoggedIn && (
          <>
        <NavLink to="/favorites" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
           Favoritos
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Perfil
        </NavLink>
        </>
        )}
        </nav>
        <div className="header-actions">
          <form onSubmit={handleSearchSubmit} className="header-search-form">
            <input
              type="text"
              placeholder="Buscar anime..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-btn">🔍</button>
          </form>
          <div className="auth-buttons">
            {isLoggedIn ? (
              <>
                <span className="user-name">Olá, {user?.name}</span>
                <button onClick={logout} className="btn btn-small">Sair</button>
              </>
            ) : (
              <Link to="/auth" className="btn btn-small">Entrar</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;