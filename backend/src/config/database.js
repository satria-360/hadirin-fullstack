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
    // Pastikan proof_url & photo_url bertipe LONGTEXT agar muat menyimpan base64 gambar resolusi penuh tanpa terpotong
    await connection.query('ALTER TABLE picket_reports MODIFY proof_url LONGTEXT');
    await connection.query('ALTER TABLE picket_photos MODIFY photo_url LONGTEXT');
    connection.release();
  } catch (error) {
    console.error('Gagal terhubung ke database:', error.message);
  }
};

module.exports = {
  db,
  initDb
};
