const { Model } = require('objection');
const User = require('./User');

class Post extends Model {
  static get tableName() {
    return 'posts';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['user_id', 'content'],
      properties: {
        id: { type: 'integer' },
        user_id: { type: 'integer' },
        content: { type: 'string' },
        image_url: { type: ['string', 'null'] },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    };
  }

  // Define relation to User
  static get relationMappings() {
    return {
      author: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'posts.user_id',
          to: 'users.id',
        },
      },
    };
  }
}

module.exports = Post;

