const db = require('../config/database'); // caminho correto para config/database.js

const User = {
  create: (name, email, hashedPassword, callback) => {
    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.run(sql, [name, email, hashedPassword], function(err) {
      callback(err, this?.lastID);
    });
  },
  findByEmail: (email, callback) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.get(sql, [email], (err, row) => callback(err, row));
  },
  findById: (id, callback) => {
    const sql = 'SELECT id, name, email, avatar, created_at FROM users WHERE id = ?';
    db.get(sql, [id], (err, row) => callback(err, row));
  },
  updateAvatar: (id, avatarPath, callback) => {
    const sql = 'UPDATE users SET avatar = ? WHERE id = ?';
    db.run(sql, [avatarPath, id], (err) => callback(err));
  }
};

module.exports = User;