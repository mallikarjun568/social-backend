const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { updateProfileSchema, updatePasswordSchema } = require('../validators/user.validators');

router.get('/profile', authenticate, UserController.getProfile);
router.put('/profile', authenticate, validate(updateProfileSchema), UserController.updateProfile);
router.put('/password', authenticate, validate(updatePasswordSchema), UserController.updatePassword);

module.exports = router;


