const Joi = require('joi');

const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(1).max(50).optional(),
  lastName: Joi.string().min(1).max(50).optional(),
  bio: Joi.string().max(500).optional(),
  avatar: Joi.string().uri().optional(),
});

const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});

module.exports = {
  updateProfileSchema,
  updatePasswordSchema,
};


