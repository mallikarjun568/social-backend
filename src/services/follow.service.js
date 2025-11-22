const pool = require('../config/db');
const logger = require('../utils/logger');

const FollowService = {
  async followUser(followerId, followingId) {
    try {
      if (followerId === followingId) {
        throw new Error('Cannot follow yourself');
      }

      // Check if already following
      const existing = await pool.query(
        'SELECT * FROM follows WHERE follower_id = $1 AND following_id = $2',
        [followerId, followingId]
      );

      if (existing.rows.length > 0) {
        throw new Error('Already following this user');
      }

      // Check if user exists
      const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [followingId]);
      if (userCheck.rows.length === 0) {
        throw new Error('User not found');
      }

      await pool.query(
        'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)',
        [followerId, followingId]
      );

      return { message: 'Successfully followed user' };
    } catch (error) {
      logger.error('Follow user error:', error);
      throw error;
    }
  },

  async unfollowUser(followerId, followingId) {
    try {
      const result = await pool.query(
        'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2 RETURNING *',
        [followerId, followingId]
      );

      if (result.rows.length === 0) {
        throw new Error('Not following this user');
      }

      return { message: 'Successfully unfollowed user' };
    } catch (error) {
      logger.error('Unfollow user error:', error);
      throw error;
    }
  },

  async getFollowers(userId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const result = await pool.query(
        `SELECT u.id, u.username, u.first_name, u.last_name, u.bio, u.avatar, f.created_at as followed_at
         FROM follows f
         JOIN users u ON f.follower_id = u.id
         WHERE f.following_id = $1
         ORDER BY f.created_at DESC
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );

      return result.rows.map((row) => ({
        id: row.id,
        username: row.username,
        firstName: row.first_name,
        lastName: row.last_name,
        bio: row.bio,
        avatar: row.avatar,
        followedAt: row.followed_at,
      }));
    } catch (error) {
      logger.error('Get followers error:', error);
      throw error;
    }
  },

  async getFollowing(userId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const result = await pool.query(
        `SELECT u.id, u.username, u.first_name, u.last_name, u.bio, u.avatar, f.created_at as followed_at
         FROM follows f
         JOIN users u ON f.following_id = u.id
         WHERE f.follower_id = $1
         ORDER BY f.created_at DESC
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );

      return result.rows.map((row) => ({
        id: row.id,
        username: row.username,
        firstName: row.first_name,
        lastName: row.last_name,
        bio: row.bio,
        avatar: row.avatar,
        followedAt: row.followed_at,
      }));
    } catch (error) {
      logger.error('Get following error:', error);
      throw error;
    }
  },

  async getFollowingIds(userId) {
    try {
      const result = await pool.query(
        'SELECT following_id FROM follows WHERE follower_id = $1',
        [userId]
      );
      return result.rows.map((row) => row.following_id);
    } catch (error) {
      logger.error('Get following IDs error:', error);
      throw error;
    }
  },
};

module.exports = FollowService;


