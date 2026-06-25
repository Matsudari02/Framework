const Favorite = require('../models/Favorite');

exports.getFavorites = (req, res) => {
  Favorite.findByUser(req.userId, (err, favorites) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar favoritos' });
    res.json({ favorites });
  });
};

exports.addFavorite = (req, res) => {
  const { animeId, animeData } = req.body;
  if (!animeId || !animeData) return res.status(400).json({ error: 'Dados incompletos' });

  Favorite.exists(req.userId, animeId, (err, exists) => {
    if (err) return res.status(500).json({ error: 'Erro ao verificar' });
    if (exists) return res.status(400).json({ error: 'Anime já está nos favoritos' });

    Favorite.add(req.userId, animeId, animeData, (err) => {
      if (err) return res.status(500).json({ error: 'Erro ao adicionar' });
      res.json({ message: 'Favorito adicionado' });
    });
  });
};

exports.removeFavorite = (req, res) => {
  const { animeId } = req.params;
  if (!animeId) return res.status(400).json({ error: 'ID obrigatório' });

  Favorite.remove(req.userId, animeId, (err) => {
    if (err) return res.status(500).json({ error: 'Erro ao remover' });
    res.json({ message: 'Favorito removido' });
  });
};

exports.checkFavorite = (req, res) => {
  const userId = req.userId;
  const animeId = parseInt(req.params.animeId);
  Favorite.exists(userId, animeId, (err, exists) => {
    if (err) return res.status(500).json({ error: 'Erro ao verificar' });
    res.json({ isFavorite: exists });
  });
};