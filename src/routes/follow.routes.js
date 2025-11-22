const express = require('express');
const router = express.Router();
const FollowController = require('../controllers/follow.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/:userId', authenticate, FollowController.followUser);
router.delete('/:userId', authenticate, FollowController.unfollowUser);
router.get('/:userId/followers', FollowController.getFollowers);
router.get('/:userId/following', FollowController.getFollowing);

module.exports = router;


