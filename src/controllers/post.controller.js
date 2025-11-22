const PostService = require('../services/post.service');

const PostController = {
  async createPost(req, res, next) {
    try {
      const post = await PostService.createPost(req.user.userId, req.body);
      res.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: post,
      });
    } catch (error) {
      next(error);
    }
  },

  async getPost(req, res, next) {
    try {
      const post = await PostService.getPostById(req.params.id);
      res.status(200).json({
        success: true,
        data: post,
      });
    } catch (error) {
      next(error);
    }
  },

  async getUserPosts(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const posts = await PostService.getUserPosts(req.params.userId, page, limit);
      res.status(200).json({
        success: true,
        data: posts,
      });
    } catch (error) {
      next(error);
    }
  },

  async getFeed(req, res, next) {
    try {
      const FollowService = require('../services/follow.service');
      const followingIds = await FollowService.getFollowingIds(req.user.userId);
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const posts = await PostService.getFeed([req.user.userId, ...followingIds], page, limit);
      res.status(200).json({
        success: true,
        data: posts,
      });
    } catch (error) {
      next(error);
    }
  },

  async updatePost(req, res, next) {
    try {
      const post = await PostService.updatePost(req.params.id, req.user.userId, req.body);
      res.status(200).json({
        success: true,
        message: 'Post updated successfully',
        data: post,
      });
    } catch (error) {
      next(error);
    }
  },

  async deletePost(req, res, next) {
    try {
      await PostService.deletePost(req.params.id, req.user.userId);
      res.status(200).json({
        success: true,
        message: 'Post deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = PostController;


