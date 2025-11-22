const pool = require('../config/db');

const PostModel = {
  async findById(id) {
    const result = await pool.query(
      `SELECT p.*, 
              u.id as author_id, u.username as author_username, 
              u.first_name as author_first_name, u.last_name as author_last_name,
              u.avatar as author_avatar
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async findByUserId(userId, limit = 10, offset = 0) {
    const result = await pool.query(
      `SELECT p.*, 
              u.id as author_id, u.username as author_username, 
              u.first_name as author_first_name, u.last_name as author_last_name,
              u.avatar as author_avatar
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.user_id = $1
       ORDER BY p.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  },

  async findFeed(userIds, limit = 10, offset = 0) {
    if (!userIds || userIds.length === 0) return [];
    
    const placeholders = userIds.map((_, i) => `$${i + 1}`).join(',');
    const result = await pool.query(
      `SELECT p.*, 
              u.id as author_id, u.username as author_username, 
              u.first_name as author_first_name, u.last_name as author_last_name,
              u.avatar as author_avatar
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.user_id IN (${placeholders})
       ORDER BY p.created_at DESC
       LIMIT $${userIds.length + 1} OFFSET $${userIds.length + 2}`,
      [...userIds, limit, offset]
    );
    return result.rows;
  },

  async create(postData) {
    const { userId, content, imageUrl } = postData;
    const result = await pool.query(
      `INSERT INTO posts (user_id, content, image_url)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, content, imageUrl || null]
    );
    return result.rows[0];
  },

  async update(id, updateData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        const dbKey = key === 'imageUrl' ? 'image_url' : key;
        fields.push(`${dbKey} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) return null;

    values.push(id);
    const query = `UPDATE posts SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${paramCount} RETURNING *`;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  },
};

module.exports = PostModel;


