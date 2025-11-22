const { Model } = require('objection');

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'email', 'password_hash'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        email: { type: 'string', format: 'email' },
        password_hash: { type: 'string' },
        bio: { type: ['string', 'null'] },
        avatar_url: { type: ['string', 'null'] },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    };
  }

  // Example: Hide password_hash from JSON output
  $formatJson(json) {
    json = super.$formatJson(json);
    delete json.password_hash;
    return json;
  }
}

module.exports = User;

