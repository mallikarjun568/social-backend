const { Model } = require('objection');
const Post = require('./Post');
const User = require('./User');

class Comment extends Model {
  static get tableName() {
    return 'comments';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['post_id', 'user_id', 'content'],
      properties: {
        id: { type: 'integer' },
        post_id: { type: 'integer' },
        user_id: { type: 'integer' },
        content: { type: 'string', minLength: 1 },
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
          from: 'comments.post_id',
          to: 'posts.id',
        },
      },
      author: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'comments.user_id',
          to: 'users.id',
        },
      },
    };
  }
}

module.exports = Comment;

