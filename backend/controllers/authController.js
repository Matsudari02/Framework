const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }
  if (!email.includes('@')) return res.status(400).json({ error: 'Email inválido' });
  if (password.length < 4) return res.status(400).json({ error: 'Senha muito curta' });

  bcrypt.hash(password, 10, (err, hashed) => {
    if (err) return res.status(500).json({ error: 'Erro ao processar senha' });
    User.create(name, email, hashed, (err, userId) => {
      if (err) {
        if (err.message.includes('UNIQUE')) return res.status(400).json({ error: 'Email já cadastrado' });
        return res.status(500).json({ error: 'Erro ao criar usuário' });
      }
      const token = jwt.sign({ userId, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.status(201).json({ message: 'Usuário criado', token, user: { id: userId, name, email } });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email e senha obrigatórios' });

  User.findByEmail(email, (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Credenciais inválidas' });
    bcrypt.compare(password, user.password, (err, isValid) => {
      if (err || !isValid) return res.status(401).json({ error: 'Credenciais inválidas' });
      const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.json({ message: 'Login realizado', token, user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } });
    });
  });
};

exports.getProfile = (req, res) => {
  User.findById(req.userId, (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json({ user });
  });
};

exports.updateAvatar = (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  const avatarPath = `/uploads/avatars/${req.file.filename}`;
  User.updateAvatar(req.userId, avatarPath, (err) => {
    if (err) return res.status(500).json({ error: 'Erro ao salvar avatar' });
    res.json({ message: 'Avatar atualizado', avatar: avatarPath });
  });
};