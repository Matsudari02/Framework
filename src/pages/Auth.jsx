import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCruntRoll } from '../contexts/CruntRollContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useCruntRoll();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (login(email, password)) {
        navigate('/');
      } else {
        setError('Email ou senha inválidos (mínimo 4 caracteres)');
      }
    } else {
      if (password !== confirmPassword) {
        setError('As senhas não coincidem');
        return;
      }
      if (register(name, email, password)) {
        navigate('/');
      } else {
        setError('Preencha todos os campos corretamente');
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Login' : 'Cadastro'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha (mín. 4 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirmar senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn">
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>
        <p>
          {isLogin ? 'Não tem conta? ' : 'Já tem conta? '}
          <button className="link-btn" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Cadastre-se' : 'Faça login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;