const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);
router.get('/', favoriteController.getFavorites);
router.post('/', favoriteController.addFavorite);
router.delete('/:animeId', favoriteController.removeFavorite);
router.get('/check/:animeId', favoriteController.checkFavorite);

module.exports = router;