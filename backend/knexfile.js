require('dotenv').config();

const dbConfig = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'db_hadirin',
  },
  migrations: {
    directory: './src/database/migrations'
  }
};

module.exports = {
  development: dbConfig,
  production: dbConfig,
};