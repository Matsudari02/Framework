const db = require('../config/database');

const Favorite = {
  add: (userId, animeId, animeData, callback) => {
    const sql = 'INSERT INTO favorites (user_id, anime_id, anime_data) VALUES (?, ?, ?)';
    db.run(sql, [userId, animeId, JSON.stringify(animeData)], function(err) {
      callback(err, this?.lastID);
    });
  },
  remove: (userId, animeId, callback) => {
    const sql = 'DELETE FROM favorites WHERE user_id = ? AND anime_id = ?';
    db.run(sql, [userId, animeId], (err) => callback(err));
  },
  findByUser: (userId, callback) => {
  const sql = 'SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC';
  db.all(sql, [userId], (err, rows) => {
    if (err) return callback(err, null);
    const favorites = rows.map(row => ({
      ...row,
      anime_data: typeof row.anime_data === 'string' ? JSON.parse(row.anime_data) : row.anime_data
    }));
    callback(null, favorites);
  });
},
  exists: (userId, animeId, callback) => {
    const sql = 'SELECT id FROM favorites WHERE user_id = ? AND anime_id = ?';
    db.get(sql, [userId, animeId], (err, row) => callback(err, !!row));
  }
};

module.exports = Favorite;