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

  // 🔥 Validação de senha forte
  const validatePassword = (pwd) => {
    if (pwd.length < 8) return 'A senha deve ter pelo menos 8 caracteres.';
    if (!/[A-Z]/.test(pwd)) return 'A senha deve conter uma letra maiúscula.';
    if (!/[a-z]/.test(pwd)) return 'A senha deve conter uma letra minúscula.';
    if (!/[0-9]/.test(pwd)) return 'A senha deve conter um número.';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) return 'A senha deve conter um caractere especial.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const success = await login(email, password);
      if (success) navigate('/');
      else setError('Email ou senha inválidos.');
    } else {
      const pwdError = validatePassword(password);
      if (pwdError) {
        setError(pwdError);
        return;
      }
      if (password !== confirmPassword) {
        setError('As senhas não coincidem.');
        return;
      }
      const success = await register(name, email, password);
      if (success) navigate('/');
      else setError('Erro ao cadastrar. Tente outro email.');
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
            placeholder="Senha (mín. 8 caracteres, 1 maiúscula, 1 número, 1 especial)"
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