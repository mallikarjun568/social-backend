const pool = require('../config/db');
const logger = require('../utils/logger');

const CommentService = {
  async createComment(userId, postId, content) {
    try {
      const result = await pool.query(
        `INSERT INTO comments (user_id, post_id, content)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [userId, postId, content]
      );

      const comment = result.rows[0];
      const userResult = await pool.query(
        'SELECT id, username, first_name, last_name, avatar FROM users WHERE id = $1',
        [userId]
      );

      return {
        id: comment.id,
        content: comment.content,
        author: {
          id: userResult.rows[0].id,
          username: userResult.rows[0].username,
          firstName: userResult.rows[0].first_name,
          lastName: userResult.rows[0].last_name,
          avatar: userResult.rows[0].avatar,
        },
        postId: comment.post_id,
        createdAt: comment.created_at,
      };
    } catch (error) {
      logger.error('Create comment error:', error);
      throw error;
    }
  },

  async getPostComments(postId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const result = await pool.query(
        `SELECT c.*, 
                u.id as author_id, u.username as author_username,
                u.first_name as author_first_name, u.last_name as author_last_name,
                u.avatar as author_avatar
         FROM comments c
         JOIN users u ON c.user_id = u.id
         WHERE c.post_id = $1
         ORDER BY c.created_at DESC
         LIMIT $2 OFFSET $3`,
        [postId, limit, offset]
      );

      return result.rows.map((row) => ({
        id: row.id,
        content: row.content,
        author: {
          id: row.author_id,
          username: row.author_username,
          firstName: row.author_first_name,
          lastName: row.author_last_name,
          avatar: row.author_avatar,
        },
        postId: row.post_id,
        createdAt: row.created_at,
      }));
    } catch (error) {
      logger.error('Get comments error:', error);
      throw error;
    }
  },

  async updateComment(commentId, userId, content) {
    try {
      const checkResult = await pool.query(
        'SELECT user_id FROM comments WHERE id = $1',
        [commentId]
      );

      if (checkResult.rows.length === 0) {
        throw new Error('Comment not found');
      }

      if (checkResult.rows[0].user_id !== userId) {
        throw new Error('Unauthorized to update this comment');
      }

      const result = await pool.query(
        `UPDATE comments SET content = $1, updated_at = NOW()
         WHERE id = $2
         RETURNING *`,
        [content, commentId]
      );

      return {
        id: result.rows[0].id,
        content: result.rows[0].content,
        updatedAt: result.rows[0].updated_at,
      };
    } catch (error) {
      logger.error('Update comment error:', error);
      throw error;
    }
  },

  async deleteComment(commentId, userId) {
    try {
      const checkResult = await pool.query(
        'SELECT user_id FROM comments WHERE id = $1',
        [commentId]
      );

      if (checkResult.rows.length === 0) {
        throw new Error('Comment not found');
      }

      if (checkResult.rows[0].user_id !== userId) {
        throw new Error('Unauthorized to delete this comment');
      }

      await pool.query('DELETE FROM comments WHERE id = $1', [commentId]);
      return { message: 'Comment deleted successfully' };
    } catch (error) {
      logger.error('Delete comment error:', error);
      throw error;
    }
  },
};

module.exports = CommentService;


