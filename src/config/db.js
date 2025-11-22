const knex = require('knex');
const { Model } = require('objection');

let knexInstance;

async function initDb() {
  knexInstance = knex({
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      database: process.env.DB_NAME || 'social_db',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    },
    pool: {
      min: 2,
      max: 10,
    },
  });

  // Bind Objection models to Knex instance
  Model.knex(knexInstance);

  // Test connection
  try {
    await knexInstance.raw('SELECT 1');
    console.log('✅ Database connected successfully');
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
    throw err;
  }
}

function getDb() {
  if (!knexInstance) {
    throw new Error('Database not initialized. Call initDb() first.');
  }
  return knexInstance;
}

function getKnex() {
  return getDb();
}

module.exports = { initDb, getDb, getKnex };
