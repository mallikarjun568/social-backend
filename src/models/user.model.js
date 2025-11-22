const pool = require('../config/db');

const UserModel = {
  async findById(id) {
    const result = await pool.query(
      'SELECT id, username, email, first_name, last_name, bio, avatar, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  },

  async findByUsername(username) {
    const result = await pool.query(
      'SELECT id, username, email, first_name, last_name, bio, avatar, created_at, updated_at FROM users WHERE username = $1',
      [username]
    );
    return result.rows[0];
  },

  async create(userData) {
    const { username, email, password, firstName, lastName } = userData;
    const result = await pool.query(
      `INSERT INTO users (username, email, password, first_name, last_name)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, username, email, first_name, last_name, created_at`,
      [username, email, password, firstName || null, lastName || null]
    );
    return result.rows[0];
  },

  async update(id, updateData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) return null;

    values.push(id);
    const query = `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${paramCount} RETURNING id, username, email, first_name, last_name, bio, avatar, updated_at`;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },
};

module.exports = UserModel;


