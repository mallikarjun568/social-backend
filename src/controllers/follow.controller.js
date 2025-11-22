const FollowService = require('../services/follow.service');

const FollowController = {
  async followUser(req, res, next) {
    try {
      await FollowService.followUser(req.user.userId, req.params.userId);
      res.status(200).json({
        success: true,
        message: 'User followed successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  async unfollowUser(req, res, next) {
    try {
      await FollowService.unfollowUser(req.user.userId, req.params.userId);
      res.status(200).json({
        success: true,
        message: 'User unfollowed successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  async getFollowers(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const followers = await FollowService.getFollowers(req.params.userId, page, limit);
      res.status(200).json({
        success: true,
        data: followers,
      });
    } catch (error) {
      next(error);
    }
  },

  async getFollowing(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const following = await FollowService.getFollowing(req.params.userId, page, limit);
      res.status(200).json({
        success: true,
        data: following,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = FollowController;


