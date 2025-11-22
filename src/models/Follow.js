const { Model } = require('objection');
const User = require('./User');

class Follow extends Model {
  static get tableName() {
    return 'follows';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['follower_id', 'following_id'],
      properties: {
        id: { type: 'integer' },
        follower_id: { type: 'integer' },
        following_id: { type: 'integer' },
        created_at: { type: 'string', format: 'date-time' },
      },
    };
  }

  // Define relations
  static get relationMappings() {
    return {
      follower: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'follows.follower_id',
          to: 'users.id',
        },
      },
      following: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'follows.following_id',
          to: 'users.id',
        },
      },
    };
  }
}

module.exports = Follow;

