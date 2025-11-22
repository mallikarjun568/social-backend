const express = require('express');
const router = express.Router();
const PostController = require('../controllers/post.controller');
const { authenticate } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { createPostSchema, updatePostSchema } = require('../validators/post.validators');

router.post('/', authenticate, validate(createPostSchema), PostController.createPost);
router.get('/feed', authenticate, PostController.getFeed);
router.get('/:id', PostController.getPost);
router.get('/user/:userId', PostController.getUserPosts);
router.put('/:id', authenticate, validate(updatePostSchema), PostController.updatePost);
router.delete('/:id', authenticate, PostController.deletePost);

module.exports = router;


