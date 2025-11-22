const { Model } = require('objection');
const Post = require('./Post');
const User = require('./User');

class Like extends Model {
  static get tableName() {
    return 'likes';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['post_id', 'user_id'],
      properties: {
        id: { type: 'integer' },
        post_id: { type: 'integer' },
        user_id: { type: 'integer' },
        created_at: { type: 'string', format: 'date-time' },
      },
    };
  }

  // Define relations
  static get relationMappings() {
    return {
      post: {
        relation: Model.BelongsToOneRelation,
        modelClass: Post,
        join: {
          from: 'likes.post_id',
          to: 'posts.id',
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'likes.user_id',
          to: 'users.id',
        },
      },
    };
  }
}

module.exports = Like;

