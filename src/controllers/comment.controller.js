const CommentService = require('../services/comment.service');

const CommentController = {
  async createComment(req, res, next) {
    try {
      const { content } = req.body;
      const comment = await CommentService.createComment(
        req.user.userId,
        req.params.postId,
        content
      );
      res.status(201).json({
        success: true,
        message: 'Comment created successfully',
        data: comment,
      });
    } catch (error) {
      next(error);
    }
    
  },

  async getComments(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const comments = await CommentService.getPostComments(req.params.postId, page, limit);
      res.status(200).json({
        success: true,
        data: comments,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateComment(req, res, next) {
    try {
      const { content } = req.body;
      const comment = await CommentService.updateComment(req.params.id, req.user.userId, content);
      res.status(200).json({
        success: true,
        message: 'Comment updated successfully',
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteComment(req, res, next) {
    try {
      await CommentService.deleteComment(req.params.id, req.user.userId);
      res.status(200).json({
        success: true,
        message: 'Comment deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = CommentController;


