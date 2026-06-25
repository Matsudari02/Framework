const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  avatar: user.avatar || null
});

exports.register = (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }
  if (!email.includes('@')) return res.status(400).json({ error: 'Email inválido' });

  // Validação de senha forte (já implementada)
  if (password.length < 8) {
    return res.status(400).json({ error: 'A senha deve ter pelo menos 8 caracteres.' });
  }
  if (!/[A-Z]/.test(password)) {
    return res.status(400).json({ error: 'A senha deve conter pelo menos uma letra maiúscula.' });
  }
  if (!/[a-z]/.test(password)) {
    return res.status(400).json({ error: 'A senha deve conter pelo menos uma letra minúscula.' });
  }
  if (!/[0-9]/.test(password)) {
    return res.status(400).json({ error: 'A senha deve conter pelo menos um número.' });
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return res.status(400).json({ error: 'A senha deve conter pelo menos um caractere especial.' });
  }

  bcrypt.hash(password, 10, (err, hashed) => {
    if (err) return res.status(500).json({ error: 'Erro ao processar senha' });
    User.create(name, email, hashed, (err, userId) => {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'Email já cadastrado' });
        }
        return res.status(500).json({ error: 'Erro ao criar usuário' });
      }
      const token = jwt.sign({ userId, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
      // 🔥 Retornar o usuário com avatar (mesmo que nulo)
      res.status(201).json({
        message: 'Usuário criado',
        token,
        user: { id: userId, name, email, avatar: null }
      });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha obrigatórios' });
  }

  User.findByEmail(email, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    bcrypt.compare(password, user.password, (err, isValid) => {
      if (err || !isValid) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      // 🔥 Inclui o avatar no retorno
      res.json({
        message: 'Login realizado',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar || null
        }
      });
    });
  });
};

exports.getProfile = (req, res) => {
  User.findById(req.userId, (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json({ user }); // já contém avatar
  });
};

exports.updateAvatar = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  }

  const avatarPath = `/uploads/avatars/${req.file.filename}`;

  User.updateAvatar(req.userId, avatarPath, (err) => {
    if (err) return res.status(500).json({ error: 'Erro ao salvar avatar' });

    User.findById(req.userId, (err, user) => {
      if (err || !user) return res.status(500).json({ error: 'Erro ao buscar usuário' });
      res.json({
        message: 'Avatar atualizado',
        avatar: avatarPath,
        user
      });
    });
  });
};