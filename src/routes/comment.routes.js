const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/comment.controller');
const { authenticate } = require('../middleware/auth.middleware');
const Joi = require('joi');
const validate = require('../middleware/validate.middleware');

const createCommentSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required(),
});

const updateCommentSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required(),
});

router.post('/post/:postId', authenticate, validate(createCommentSchema), CommentController.createComment);
router.get('/post/:postId', CommentController.getComments);
router.put('/:id', authenticate, validate(updateCommentSchema), CommentController.updateComment);
router.delete('/:id', authenticate, CommentController.deleteComment);

module.exports = router;


