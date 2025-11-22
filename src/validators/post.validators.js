const Joi = require('joi');

const createPostSchema = Joi.object({
  content: Joi.string().min(1).max(5000).required(),
  imageUrl: Joi.string().uri().optional(),
});

const updatePostSchema = Joi.object({
  content: Joi.string().min(1).max(5000).optional(),
  imageUrl: Joi.string().uri().optional(),
});

module.exports = {
  createPostSchema,
  updatePostSchema,
};


