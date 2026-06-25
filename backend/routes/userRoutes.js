const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

// Apenas um exemplo, poderia ser estendido
router.get('/me', auth, (req, res) => {
  res.json({ userId: req.userId });
});

module.exports = router;