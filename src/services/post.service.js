const PostModel = require('../models/post.model');
const logger = require('../utils/logger');

const PostService = {
  async createPost(userId, postData) {
    try {
      const post = await PostModel.create({
        userId,
        ...postData,
      });

      const fullPost = await PostModel.findById(post.id);
      return this.formatPost(fullPost);
    } catch (error) {
      logger.error('Create post error:', error);
      throw error;
    }
  },

  async getPostById(postId) {
    try {
      const post = await PostModel.findById(postId);
      if (!post) {
        throw new Error('Post not found');
      }
      return this.formatPost(post);
    } catch (error) {
      logger.error('Get post error:', error);
      throw error;
    }
  },

  async getUserPosts(userId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const posts = await PostModel.findByUserId(userId, limit, offset);
      return posts.map((post) => this.formatPost(post));
    } catch (error) {
      logger.error('Get user posts error:', error);
      throw error;
    }
  },

  async getFeed(userIds, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const posts = await PostModel.findFeed(userIds, limit, offset);
      return posts.map((post) => this.formatPost(post));
    } catch (error) {
      logger.error('Get feed error:', error);
      throw error;
    }
  },

  async updatePost(postId, userId, updateData) {
    try {
      const post = await PostModel.findById(postId);
      if (!post) {
        throw new Error('Post not found');
      }

      if (post.user_id !== userId) {
        throw new Error('Unauthorized to update this post');
      }

      const updatedPost = await PostModel.update(postId, updateData);
      return this.formatPost(updatedPost);
    } catch (error) {
      logger.error('Update post error:', error);
      throw error;
    }
  },

  async deletePost(postId, userId) {
    try {
      const post = await PostModel.findById(postId);
      if (!post) {
        throw new Error('Post not found');
      }

      if (post.user_id !== userId) {
        throw new Error('Unauthorized to delete this post');
      }

      await PostModel.delete(postId);
      return { message: 'Post deleted successfully' };
    } catch (error) {
      logger.error('Delete post error:', error);
      throw error;
    }
  },

  formatPost(post) {
    return {
      id: post.id,
      content: post.content,
      imageUrl: post.image_url,
      author: {
        id: post.author_id,
        username: post.author_username,
        firstName: post.author_first_name,
        lastName: post.author_last_name,
        avatar: post.author_avatar,
      },
      createdAt: post.created_at,
      updatedAt: post.updated_at,
    };
  },
};

module.exports = PostService;


