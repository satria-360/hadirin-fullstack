require('dotenv').config();
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'db_hadirin',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const initDb = async () => {
  try {
    const connection = await db.getConnection();
    console.log(`Berhasil terhubung ke database ${process.env.DB_NAME || 'db_hadirin'}!`);
    connection.release();
  } catch (error) {
    console.error('Gagal terhubung ke database:', error.message);
  }
};

module.exports = {
  db,
  initDb
};